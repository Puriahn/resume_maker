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


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ('id', 'institute_name', 'start_date', 'end_date')


class UserSerializer(serializers.ModelSerializer):
    educations = EducationSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone_number', 'job_title', 'summary', 'image', 'skills', 'educations')


class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()


class ResendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()

