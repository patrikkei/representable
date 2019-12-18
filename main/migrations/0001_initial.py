#
# Copyright (c) 2019- Representable Team (Theodor Marcu, Lauren Johnston, Somya Arora, Kyle Barnes, Preeti Iyer).
#
# This file is part of Representable
# (see http://representable.org).
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.contrib.gis.db.models.fields
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0011_update_proxy_permissions"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "password",
                    models.CharField(max_length=128, verbose_name="password"),
                ),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={
                            "unique": "A user with that username already exists."
                        },
                        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                        max_length=150,
                        unique=True,
                        validators=[
                            django.contrib.auth.validators.UnicodeUsernameValidator()
                        ],
                        verbose_name="username",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=30, verbose_name="first name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="last name"
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True,
                        max_length=254,
                        verbose_name="email address",
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        verbose_name="date joined",
                    ),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "abstract": False,
            },
            managers=[("objects", django.contrib.auth.models.UserManager()),],
        ),
        migrations.CreateModel(
            name="CommunityEntry",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "entry_ID",
                    models.CharField(
                        default=uuid.uuid4, max_length=100, unique=True
                    ),
                ),
                (
                    "user_polygon",
                    django.contrib.gis.db.models.fields.PolygonField(
                        geography=True, srid=4326
                    ),
                ),
                (
                    "census_blocks_polygon_array",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=django.contrib.gis.db.models.fields.PolygonField(
                            blank=True, geography=True, null=True, srid=4326
                        ),
                        blank=True,
                        null=True,
                        size=None,
                    ),
                ),
                (
                    "census_blocks_polygon",
                    django.contrib.gis.db.models.fields.MultiPolygonField(
                        blank=True, geography=True, null=True, srid=4326
                    ),
                ),
                (
                    "my_community",
                    models.CharField(
                        choices=[
                            ("Y", "Yes, this is my community."),
                            (
                                "N",
                                "No, I am creating this community on behalf of another group of people.",
                            ),
                        ],
                        default="Y",
                        max_length=1,
                        verbose_name="Is this your community?",
                    ),
                ),
            ],
            options={"db_table": "community_entry",},
        ),
        migrations.CreateModel(
            name="Tag",
            fields=[
                (
                    "name",
                    models.CharField(
                        max_length=100, primary_key=True, serialize=False
                    ),
                ),
            ],
            options={"ordering": ("name",),},
        ),
        migrations.CreateModel(
            name="Issue",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "category",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("", "Select Category"),
                            ("zoning", "Zoning"),
                            ("policing", "Policing"),
                            ("crime", "Crime"),
                            ("environmental", "Environmental"),
                            ("nuisance", "Nuisance"),
                            ("school", "School"),
                            ("religion", "Religion/Church"),
                            ("race", "Race/Ethnicity"),
                            ("immigration", "Immigration Status"),
                            ("socioeconomic", "Socioeconomic"),
                            ("transportation", "Transportation"),
                            (
                                "neighborhood",
                                "Neighborhood Identity/Official Definition",
                            ),
                            ("lgbt", "LGBT Issues"),
                        ],
                        default=None,
                        max_length=50,
                    ),
                ),
                ("description", models.CharField(blank=True, max_length=250)),
                (
                    "entry",
                    models.ForeignKey(
                        default=None,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="main.CommunityEntry",
                    ),
                ),
            ],
            options={"ordering": ("category", "description"),},
        ),
        migrations.AddField(
            model_name="communityentry",
            name="tags",
            field=models.ManyToManyField(blank=True, to="main.Tag"),
        ),
        migrations.AddField(
            model_name="communityentry",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
