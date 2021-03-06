# Generated by Django 2.2.4 on 2020-04-23 19:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0007_auto_20200423_0559"),
    ]

    operations = [
        migrations.CreateModel(
            name="WhiteListLink",
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
                ("date_added", models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.RemoveField(
            model_name="whitelistentry", name="date_added",
        ),
        migrations.RemoveField(model_name="organization", name="whitelist",),
        migrations.AddField(
            model_name="organization",
            name="email_whitelist",
            field=models.ManyToManyField(
                blank=True,
                through="main.WhiteListLink",
                to="main.WhiteListEntry",
            ),
        ),
        migrations.AddField(
            model_name="whitelistlink",
            name="email",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="main.WhiteListEntry",
            ),
        ),
        migrations.AddField(
            model_name="whitelistlink",
            name="organization",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="main.Organization",
            ),
        ),
    ]
