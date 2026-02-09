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


# class UserSerializer(serializers.ModelSerializer):
#     summary = SummarySerializer(many=False, read_only=True)
#     educations = EducationSerializer(many=True, read_only=True)
#     experiences = ExperienceSerializer(many=True, read_only=True)
#     skills = SkillSerializer(many=True, read_only=True)
#
#     section_order = serializers.ListField(
#         child=serializers.CharField(),
#         required=False
#     )
#
#     class Meta:
#         model = User
#         fields = ('id', 'email', 'full_name', 'phone_number', 'job_title', 'image', 'summary', 'skills', 'educations', 'experiences', 'section_order')
#
#     def to_representation(self, instance):
#         base = super().to_representation(instance)
#
#         raw = instance.section_order or ''
#         if raw.strip():
#             section_order = [x for x in raw.split(',') if x]
#         else:
#             section_order = ["header", "skills", "experience", "education", "summary"]
#
#         return {
#             "section_order": section_order,
#             "personal_info": {
#                 "id": base["id"],
#                 "phone": base["phone_number"],
#                 "email": base["email"],
#                 "name": base["full_name"],
#                 "img": base["image"],
#                 "job": base["job_title"],
#             },
#             "summary": base["summary"],
#             "skills": base["skills"],
#             "educations": base["educations"],
#             "experiences": base["experiences"],
#         }
#
#     def update(self, instance, validated_data):
#         # handle section_order from frontend (list -> string)
#         order = validated_data.pop('section_order', None)
#         if order is not None:
#             instance.section_order = ','.join(order)
#         return super().update(instance, validated_data)


class UserSerializer(serializers.ModelSerializer):
    # READ: nested full objects
    summary = SummarySerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)

    # WRITE: input data
    skills_input = serializers.ListField(
        child=serializers.CharField(),
        write_only=True, required=False
    )
    summary_input = SummarySerializer(write_only=True, required=False)
    educations_input = EducationSerializer(many=True, write_only=True, required=False)
    experiences_input = ExperienceSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone_number', 'job_title', 'image',
            'summary', 'skills', 'educations', 'experiences', 'section_order',
            'skills_input', 'summary_input', 'educations_input', 'experiences_input'
        ]

    def update(self, instance, validated_data):
        # Handle user fields
        user_data = {k: v for k, v in validated_data.items() if k not in [
            'skills_input', 'summary_input', 'educations_input', 'experiences_input'
        ]}
        instance = super().update(instance, user_data)

        # Skills (replace all)
        if 'skills_input' in validated_data:
            skills_data = validated_data.pop('skills_input')
            skill_objs = []
            for name in skills_data:
                skill, _ = Skill.objects.get_or_create(name=name.strip())
                skill_objs.append(skill)
            instance.skills.set(skill_objs)

        # Summary (update or create)
        if 'summary_input' in validated_data:
            summary_data = validated_data.pop('summary_input')
            summary, created = Summary.objects.update_or_create(
                user=instance,
                defaults=summary_data
            )

        # Educations (delete old, create new)
        if 'educations_input' in validated_data:
            educations_data = validated_data.pop('educations_input')
            instance.educations.all().delete()
            for edu_data in educations_data:
                edu_data['user'] = instance
                Education.objects.create(**edu_data)

        # Experiences (delete old, create new)
        if 'experiences_input' in validated_data:
            experiences_data = validated_data.pop('experiences_input')
            instance.experiences.all().delete()
            for exp_data in experiences_data:
                exp_data['user'] = instance
                Experience.objects.create(**exp_data)

        instance.save()
        return instance


class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()


class ResendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()

