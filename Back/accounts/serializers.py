from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from rest_framework import serializers
from .models import User, Skill, Summary, Education, Experience
import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework import serializers


class Base64ImageField(serializers.ImageField):
    """
    A custom field to allow uploading images via base64 strings in JSON.
    """
    def to_internal_value(self, data):
        # Check if this is a base64 string
        if isinstance(data, str) and data.startswith('data:image'):
            # format: "data:image/png;base64,iVBORw0KGgo..."
            try:
                format, imgstr = data.split(';base64,')
                ext = format.split('/')[-1]  # Get extension (png, jpg, etc.)
                file_name = f"{uuid.uuid4()}.{ext}"
                data = ContentFile(base64.b64decode(imgstr), name=file_name)
            except (ValueError, TypeError):
                raise serializers.ValidationError("Invalid image format.")

        return super().to_internal_value(data)


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


class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ('id', 'description')


class EducationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Education
        fields = ('id', 'institute_name', 'date')


class ExperienceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Experience
        fields = ('id', 'company_name', 'info', 'date')


# Create a small serializer just for Swagger's documentation of personal_info
class PersonalInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    phone = serializers.CharField(source='phone_number', allow_null=True)
    email = serializers.EmailField()
    name = serializers.CharField(source='full_name', allow_null=True)
    # img = serializers.ImageField(source='image', allow_null=True)
    img = Base64ImageField(source='image', allow_null=True, required=False)
    job = serializers.CharField(source='job_title', allow_null=True)


class UserSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()
    skills_input = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    # This field handles both the GET structure and the nested PATCH input
    personal_info = PersonalInfoSerializer(source='*', read_only=False)

    summary = SummarySerializer(required=False, allow_null=True)
    educations = EducationSerializer(many=True, required=False)
    experiences = ExperienceSerializer(many=True, required=False)
    section_order = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = User
        fields = [
            'section_order',
            'personal_info',
            'summary',
            'skills',
            'skills_input',
            'educations',
            'experiences',
        ]

    def get_skills(self, obj):
        return [skill.name for skill in obj.skills.all()]

    def to_internal_value(self, data):
        data = data.copy()
        # We ONLY need to move 'skills' because 'skills' is a read-only SerializerMethodField
        # We do NOT pop 'personal_info' here anymore; let the PersonalInfoSerializer handle it
        if 'skills' in data:
            data['skills_input'] = data.pop('skills')

        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Ensure section_order is always a list in the response
        if isinstance(instance.section_order, str):
            ret['section_order'] = [x.strip() for x in instance.section_order.split(',') if x.strip()]

        # skills_input is write_only, but we pop it just to be safe
        ret.pop('skills_input', None)
        return ret

    def update(self, instance, validated_data):
        # 1. Extract nested/special data
        # PersonalInfoSerializer(source='*') puts its results into a 'personal_info' dict
        personal_info_data = validated_data.pop('personal_info', {})
        skills_list = validated_data.pop('skills_input', None)
        summary_data = validated_data.pop('summary', None)
        educations_data = validated_data.pop('educations', None)
        experiences_data = validated_data.pop('experiences', None)
        section_order_data = validated_data.pop('section_order', None)

        # 2. Update the User model fields from the nested 'personal_info' dict
        # The keys here (full_name, phone_number, etc.) are already correctly
        # mapped because of the 'source' arguments in PersonalInfoSerializer
        for attr, value in personal_info_data.items():
            setattr(instance, attr, value)

        # 3. Update any other top-level fields (like section_order)
        if section_order_data is not None:
            instance.section_order = ",".join(section_order_data)

        # Update any remaining validated_data if exists
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # 4. Handle Skills (ManyToMany)
        if skills_list is not None:
            skill_objs = [Skill.objects.get_or_create(name=s.strip())[0] for s in skills_list]
            instance.skills.set(skill_objs)

        # 5. Handle Summary (OneToOne)
        if summary_data is not None:
            Summary.objects.update_or_create(user=instance, defaults=summary_data)

        # 6. Handle Educations (ForeignKey - Delete and Recreate)
        if educations_data is not None:
            instance.educations.all().delete()
            for edu in educations_data:
                edu.pop('id', None)
                Education.objects.create(user=instance, **edu)

        # 7. Handle Experiences (ForeignKey - Delete and Recreate)
        if experiences_data is not None:
            instance.experiences.all().delete()
            for exp in experiences_data:
                exp.pop('id', None)
                Experience.objects.create(user=instance, **exp)

        return instance

class VerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()


class ResendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()

