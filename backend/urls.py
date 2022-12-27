from django.urls import path

from .views import *

urlpatterns = [
    path("", Workspace),
    path("settings", UserSettings),
    path("boards", Get_All_Boards),
    path("board/<int:board_id>", Get_All_Tasks),
    path("notebooks", Get_All_Books),
    path("book/<int:book_id>", Get_All_Subjects),
    path("subject/<int:subject_id>", Get_All_Pages),
    path("page/<int:page_id>", Get_A_Page),
]
