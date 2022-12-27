from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import *
from .serializers import *

# User Login
class Login_View(TokenObtainPairView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        email = request.data["email"]

        try:
            User.objects.get(email=email)
            serializer.is_valid(raise_exception=True)
        except User.DoesNotExist:
            return Response(
                {"error": "This email address is not registered"}, status=404
            )
        except:
            return Response({"error": "Incorrect password"}, status=401)
        else:
            serializer.save()

        return Response(serializer.validated_data, status=200)


# User Registration
class Register_View(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        password = request.data["password"]
        confirmation = request.data["confirmation"]

        if password != confirmation:
            return Response({"error": "Passwords must match"}, status=400)

        try:
            serializer.is_valid(raise_exception=True)
        except:
            return Response({"error": "Email address already taken"}, status=409)
        else:
            serializer.save()

        token = RefreshToken.for_user(
            user=User.objects.get(email=request.data["email"])
        )

        return Response(
            {
                "access": str(token.access_token),
                "refresh": str(token),
            },
            status=201,
        )


@api_view(["PUT", "GET"])
@permission_classes([IsAuthenticated])
def UserSettings(request):
    user = request.user
    # Need implementation
    if request.method == "PUT":
        ...

    return Response(user.serialize(), status=200)


# Get all the pinned books && boards
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def Workspace(request):
    user = request.user
    boards = Board.objects.filter(user=user, pinned=True).order_by("updated")
    notebooks = Notebook.objects.filter(user=user, pinned=True).order_by("updated")

    return Response(
        {
            "boards": [board.serialize() for board in boards],
            "books": [book.serialize() for book in notebooks],
            "user": user.serialize(),
        },
        status=200,
    )


# Get all the boards
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def Get_All_Boards(request):
    user = request.user

    if request.method == "PUT":
        data = request.data

        # Create, Pin/Unpin or Delete a Board
        if data["action"] == "new":
            New_Board = Board(user=user, title="New Board")
            try:
                New_Board.save()
            except:
                return Response(status=409)
            else:
                return Response(
                    {
                        "BoardsList": [
                            bd.serialize()
                            for bd in sorted(
                                Board.objects.filter(user=user),
                                key=lambda x: (x.pinned, x.updated),
                                reverse=True,
                            )
                        ],
                        "Board": New_Board.serialize(),
                    },
                    status=201,
                )
        else:
            Get_Board = Board.objects.get(user=user, id=data["board_id"])
            Get_Pinned_Boards = Board.objects.filter(user=user, pinned=True)

            match data["action"]:
                case "title":
                    Get_Board.title = data["title"]
                    Get_Board.save()
                case "pin":
                    if len(Get_Pinned_Boards) >= 3:
                        return Response(status=409)
                    else:
                        Get_Board.pinned = True
                        Get_Board.save()
                case "unpin":
                    Get_Board.pinned = False
                    Get_Board.save()
                case "delete":
                    Get_Board.delete()
    return Response(
        [
            bd.serialize()
            for bd in sorted(
                Board.objects.filter(user=user),
                key=lambda x: (x.pinned, x.updated),
                reverse=True,
            )
        ],
        status=200,
    )


# Get all the tasks from a specific board
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def Get_All_Tasks(request, board_id):
    user = request.user
    Tasks_List = Tasks.objects.filter(user=user, board=board_id)

    # Create, Edit or Delete tasks
    if request.method == "PUT":
        data = request.data
        Get_Task = (
            Tasks.objects.get(user=user, id=data["task_id"])
            if data.get("task_id")
            else {}
        )

        match data["action"]:
            case "new":
                New_Task = Tasks(user=user, board_id=board_id, body=data["body"])
                try:
                    New_Task.save()
                except:
                    return Response(status=409)
            case "body":
                Get_Task.body = data["body"]
                Get_Task.save()
            case "status":
                Get_Task.status = data["status"]
                Get_Task.save()
            case "delete":
                Get_Task.delete()
        return Response([tsk.serialize() for tsk in Tasks_List], status=200)
    # Get all tasks
    else:
        return Response([tsk.serialize() for tsk in Tasks_List], status=200)


# Get all the books
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def Get_All_Books(request):
    user = request.user
    Books_List = Notebook.objects.filter(user=user)

    # Create, pin, unpin and delete a book
    if request.method == "PUT":
        data = request.data

        if data["action"] == "new":
            New_Book = Notebook(user=user, title="New Book")
            try:
                New_Book.save()
            except:
                return Response(status=500)
            else:
                return Response(
                    {
                        "BooksList": [
                            book.serialize()
                            for book in sorted(
                                Notebook.objects.filter(user=user),
                                key=lambda x: (x.pinned, x.updated),
                                reverse=True,
                            )
                        ],
                        "Book": New_Book.serialize(),
                    },
                    status=201,
                )
        else:
            Get_Book = Notebook.objects.get(user=user, id=data["book_id"])
            Get_Pinned_Books = Notebook.objects.filter(user=user, pinned=True)

            match data["action"]:
                case "title":
                    Get_Book.title = data["title"]
                    Get_Book.save()
                case "pin":
                    if len(Get_Pinned_Books) >= 3:
                        return Response(status=409)
                    else:
                        Get_Book.pinned = True
                        Get_Book.save()
                case "unpin":
                    Get_Book.pinned = False
                    Get_Book.save()
                case "delete":
                    Get_Book.delete()
    return Response(
        [
            book.serialize()
            for book in sorted(
                Notebook.objects.filter(user=user),
                key=lambda x: (x.pinned, x.updated),
                reverse=True,
            )
        ],
        status=200,
    )


# Get all the subjects from a specific book
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def Get_All_Subjects(request, book_id):
    user = request.user
    Subject_List = Subject.objects.filter(user=user, notebook_id=book_id)

    # Create, Edit and Delete Subjects
    if request.method == "PUT":
        data = request.data
        Get_Subject = (
            Subject.objects.get(user=user, id=data["subject_id"])
            if data.get("subject_id")
            else {}
        )

        if data["action"] == "new":
            New_Subject = Subject(user=user, notebook_id=book_id, title="New Subject")
            try:
                New_Subject.save()
            except:
                return Response(status=409)
        elif data["action"] == "title":
            Get_Subject.title = data["title"]
            Get_Subject.save()
        else:
            Get_Subject.delete()
        return Response([sbj.serialize() for sbj in Subject_List], status=200)
    # Get subjects list
    else:
        return Response([sbj.serialize() for sbj in Subject_List], status=200)


# Get all the pages from a chosen subject
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def Get_All_Pages(request, subject_id):
    user = request.user
    Pages_List = Page.objects.filter(user=user, subject_id=subject_id)

    # Create or Delete a page
    if request.method == "PUT":
        data = request.data

        if data["action"] == "new":
            New_Page = Page(
                user=user, notebook_id=data["book_id"], subject_id=subject_id
            )
            try:
                New_Page.save()
            except:
                return Response(status=409)
        else:
            Get_Page = Page.objects.get(user=user, id=data["page_id"])
            Get_Page.delete()
        return Response([pg.serialize() for pg in Pages_List], status=200)
    # Get Pages List
    else:
        return Response([pg.serialize() for pg in Pages_List], status=200)


# Get a page
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def Get_A_Page(request, page_id):
    user = request.user
    Get_Page = Page.objects.get(user=user, id=page_id)

    if request.method == "PUT":
        data = request.data

        Get_Page.body = data["body"]
        Get_Page.save()
        return Response(status=204)
    else:
        return Response(Get_Page.body, status=200)
