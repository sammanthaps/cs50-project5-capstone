from django.contrib import admin
from .models import *


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email")
    list_per_page = 10


@admin.register(Tasks)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "body", "status")
    list_per_page = 10


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "subject",
    )
    list_per_page = 10


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "notebook")
    list_per_page = 10


@admin.register(Board, Notebook)
class BoardAdmin(admin.ModelAdmin):
    list_display = ("id", "title")
    list_per_page = 10
