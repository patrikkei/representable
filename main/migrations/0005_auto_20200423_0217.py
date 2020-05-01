# Generated by Django 2.2.4 on 2020-04-23 02:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0004_auto_20200409_1923"),
    ]

    operations = [
        migrations.CreateModel(
            name="WhiteListEntry",
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
                ("email", models.CharField(max_length=128)),
            ],
            options={"ordering": ("email",),},
        ),
        migrations.RemoveField(model_name="organization", name="admin_group",),
        migrations.RemoveField(model_name="organization", name="link",),
        migrations.RemoveField(model_name="organization", name="mod_group",),
        migrations.CreateModel(
            name="Membership",
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
                ("date_joined", models.DateField(auto_now_add=True)),
                ("is_org_admin", models.BooleanField(default=False)),
                ("is_org_moderator", models.BooleanField(default=False)),
                ("is_whitelisted", models.BooleanField(default=False)),
                (
                    "member",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "organization",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="main.Organization",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="organization",
            name="members",
            field=models.ManyToManyField(
                through="main.Membership", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="organization",
            name="whitelisted_emails",
            field=models.ManyToManyField(blank=True, to="main.WhiteListEntry"),
        ),
    ]