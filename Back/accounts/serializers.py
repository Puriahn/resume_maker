from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import *
from django.core import exceptions


class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Passwords did not match!'})
        try:
            validate_password(attrs['password'])
        except exceptions.ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name')


class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ('id', 'description')


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ('id', 'institute_name', 'date')


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ('id', 'company_name', 'info', 'date')


class UserSerializer(serializers.ModelSerializer):
    summary = SummarySerializer(many=False, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)

    section_order = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone_number', 'job_title', 'image', 'summary', 'skills', 'educations', 'experiences', 'section_order')

    def to_representation(self, instance):
        base = super().to_representation(instance)

        raw = instance.section_order or ''
        if raw.strip():
            section_order = [x for x in raw.split(',') if x]
        else:
            section_order = ["header", "skills", "experience", "education", "summary"]

        return {
            "section_order": section_order,
            "personal_info": {
                "id": base["id"],
                "phone": base["phone_number"],
                "email": base["email"],
                "name": base["full_name"],
                "img": base["image"],
                "job": base["job_title"],
            },
            "summary": base["summary"],
            "skills": base["skills"],
            "educations": base["educations"],
            "experiences": base["experiences"],
        }

    def update(self, instance, validated_data):
        # handle section_order from frontend (list -> string)
        order = validated_data.pop('section_order', None)
        if order is not None:
            instance.section_order = ','.join(order)
        return super().update(instance, validated_data)


class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()


class ResendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()

