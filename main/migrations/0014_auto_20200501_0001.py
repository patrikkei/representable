# Generated by Django 2.2.6 on 2020-05-01 00:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_communityentry_organization'),
    ]

    operations = [
        migrations.AlterField(
            model_name='communityentry',
            name='entry_name',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='communityentry',
            name='entry_reason',
            field=models.TextField(default='', max_length=500),
        ),
    ]