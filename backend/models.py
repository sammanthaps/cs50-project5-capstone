from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    username = models.CharField(max_length=40, unique=False, blank=True)
    email = models.CharField(max_length=50, unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def serialize(self):
        return {
            "id": self.id,
            "first": self.first_name,
            "last": self.last_name,
            "username": self.username,
            "email": self.email,
        }


class Page(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    notebook = models.ForeignKey("Notebook", on_delete=models.CASCADE)
    subject = models.ForeignKey("Subject", on_delete=models.CASCADE)
    body = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created"]

    def __str__(self):
        return self.body[0:25]

    def getTitle(self):
        bd = self.body.split("\n")
        try:
            idx = bd[0].find("#")
        except:
            idx = 0
        else:
            idx += 1
        return f"{bd[0][idx:25]} ..."

    def serialize(self):
        return {"id": self.id, "title": self.getTitle(), "model": "Page"}


class Subject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    notebook = models.ForeignKey(
        "Notebook", on_delete=models.CASCADE, related_name="books"
    )
    title = models.CharField(max_length=20)

    def __str__(self):
        return self.title

    def serialize(self):
        return {"id": self.id, "title": self.title, "model": "Subject"}


class Tasks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    board = models.ForeignKey("Board", on_delete=models.CASCADE)
    body = models.TextField(max_length=335)
    status = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Tasks"

    def __str__(self):
        return self.body[0:15]

    def serialize(self):
        return {
            "id": self.id,
            "body": self.body,
            "status": self.status,
            "model": "Task",
        }


class Board(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=18)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    pinned = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "pinned": self.pinned,
            "model": "Board",
        }


class Notebook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    pinned = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "pinned": self.pinned,
            "model": "Book",
        }
