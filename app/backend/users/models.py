from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver


class UserInformation(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    description = models.CharField(max_length=200, blank=True)
    birth_date = models.DateField(blank=True, null=True)

    steam_url = models.URLField(max_length=250, blank=True, null=True)

    def __str__(self):
        # return "{} '{}' {}".format(self.user.first_name, self.user.username, self.user.last_name)
        return "{} ({})".format(self.user.email, self.user.username)


@receiver(post_save, sender=User)
def create_user_details(sender, instance, created, **kwargs):
    if created:
        UserInformation.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_details(sender, instance, **kwargs):
    instance.userinformation.save()


class Team(models.Model):
    name = models.CharField(max_length=40)
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name="Owner")
    members = models.ManyToManyField(User)

    def __str__(self):
        player_nicknames = [user.username for user in self.members.all()]
        return self.name + " (" + ", ".join(player_nicknames) + ")"
