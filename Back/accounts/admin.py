from django.contrib import admin
from .models import User, OtpCode, Summary, Education, Experience, Skill


class SummaryInline(admin.StackedInline):
    model = Summary
    extra = 0


class EducationInline(admin.TabularInline):
    model = Education
    extra = 1


class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 1


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "full_name", "job_title", "is_verified", "is_admin")
    inlines = [SummaryInline, EducationInline, ExperienceInline]
    filter_horizontal = ("skills",)  # manage skills here, not via inline


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(OtpCode)
class OtpCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "code", "created_at", "is_used")
    list_filter = ("is_used", "created_at")
