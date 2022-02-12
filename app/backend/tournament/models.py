from django.db import models
from django.core.files import File

from io import BytesIO
from PIL import Image

from users.models import User, Team


class Map(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to="uploads/", blank=True, null=True)
    thumbnail = models.ImageField(upload_to="uploads/", blank=True, null=True)
    matches_played = models.IntegerField(default=0)
    rounds_won_by_t = models.IntegerField(default=0)
    rounds_won_by_ct = models.IntegerField(default=0)

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name

    def get_image(self):
        if self.image:
            return 'http://127.0.0.1:8000' + self.image.url
        return ''

    def get_thumbnail(self):
        if self.thumbnail:
            return 'http://127.0.0.1:8000' + self.thumbnail.url
        else:
            if self.image:
                self.thumbnail = self.make_thumbnail(self.image)
                self.save()
                return 'http://127.0.0.1:8000' + self.thumbnail.url
            else:
                return ''

    def make_thumbnail(self, image, size=(300, 200)):
        img = Image.open(image)
        img.convert('RGB')
        img.thumbnail(size)

        thumb_io = BytesIO()
        img.save(thumb_io, 'PNG', quality=90)

        thumbnail = File(thumb_io, name=image.name)
        return thumbnail


class MapScore(models.Model):
    class Meta:
        ordering = ('pk', )

    team_a = models.ForeignKey(Team, null=True, on_delete=models.SET_NULL,
                               verbose_name=("Team A"), related_name='%(class)s_team_a')
    team_b = models.ForeignKey(Team, null=True, on_delete=models.SET_NULL,
                               verbose_name=("Team B"), related_name='%(class)s_team_b')
    rounds_won_by_team_a = models.IntegerField(default=0, verbose_name=("Rounds won by Team A"))
    rounds_won_by_team_b = models.IntegerField(default=0, verbose_name=("Rounds won by Team B"))
    winner = models.ForeignKey(Team, blank=True, null=True, on_delete=models.SET_NULL,
                               related_name='%(class)s_team_winner')
    map = models.ForeignKey(Map, blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        result = "({}:{})".format(self.rounds_won_by_team_a, self.rounds_won_by_team_b)
        map_name = "on {}".format(self.map.name) if map else None
        return "[{}] {} vs. {} {} {}".format(self.pk, self.team_a.name, self.team_b.name, map_name, result)


class Game(models.Model):
    NOT_DETERMINED = 'not_determined'
    BO1 = 'bo1'
    BO2 = 'bo2'
    BO3 = 'bo3'
    BO5 = 'bo5'
    TYPES = (
        (NOT_DETERMINED, ('Not determined')),
        (BO1, ('Best of One')),
        (BO2, ('Best of Two')),
        (BO3, ('Best of Three')),
        (BO5, ('Best of Five')),
    )

    SCHEDULED = 'scheduled'
    BANNING = 'banning'
    ONGOING = 'ongoing'
    FINISHED = 'finished'
    CANCELLED = 'cancelled'
    STATUSES = (
        (SCHEDULED, ('Scheduled')),
        (BANNING, ('Banning phase')),
        (ONGOING, ('Ongoing')),
        (FINISHED, ('Finished')),
        (CANCELLED, ('Cancelled')),
    )

    team_a = models.ForeignKey(Team, null=True, on_delete=models.SET_NULL,
                               verbose_name=("Team A"), related_name='%(class)s_team_a')
    team_b = models.ForeignKey(Team, null=True, on_delete=models.SET_NULL,
                               verbose_name=("Team B"), related_name='%(class)s_team_b')
    maps = models.ManyToManyField(Map, blank=True)
    type = models.CharField(max_length=30, choices=TYPES, default=NOT_DETERMINED)
    status = models.CharField(max_length=30, choices=STATUSES, default=SCHEDULED)
    winner = models.ForeignKey(Team, blank=True, null=True, on_delete=models.SET_NULL,
                               related_name='%(class)s_team_winner')
    map_scores = models.ManyToManyField(MapScore)

    def __str__(self):
        maps = "maps: " + ", ".join([map.name for map in self.maps.all()])
        type = "type: " + self.type
        status = "status: " + self.status
        return "[{}] {} vs. {} ({}, {}, {})".format(self.pk, self.team_a.name, self.team_b.name,
                                                    maps, type, status)


class Prize(models.Model):
    sponsor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                related_name='%(class)s_sponsor')
    name = models.CharField(max_length=100, default="")

    def __str__(self):
        return "{} sponsored by {}".format(self.name, self.sponsor)


class Tournament(models.Model):
    NOT_DETERMINED = 'not_determined'
    SINGLE_ELIMINATION = 'single_elimination'
    LEAGUE = 'league'
    COMBINED = 'combined'
    TYPES = (
        (NOT_DETERMINED, ('Not determined')),
        (SINGLE_ELIMINATION, 'Single elimination'),
        (LEAGUE, 'League (all vs. all)'),
        (COMBINED, 'Combined'),
    )

    SCHEDULED = 'scheduled'
    ONGOING = 'ongoing'
    FINISHED = 'finished'
    REMOVED = 'removed'
    STATUSES = (
        (SCHEDULED, ('Scheduled')),
        (ONGOING, ('Ongoing')),
        (FINISHED, ('Finished')),
        (REMOVED, ('Removed')),
    )

    creator = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100, default="")
    type = models.CharField(max_length=30, choices=TYPES, default=NOT_DETERMINED)
    status = models.CharField(max_length=30, choices=STATUSES, default=SCHEDULED)
    private = models.BooleanField(default=False)
    starting_date = models.DateTimeField()
    games = models.ManyToManyField(Game)
    teams = models.ManyToManyField(Team)
    winner = models.ForeignKey(Team, blank=True, null=True, on_delete=models.SET_NULL,
                               related_name='%(class)s_team_winner')
    available_maps = models.ManyToManyField(Map)
    prizes = models.ManyToManyField(Prize)

    def __str__(self):
        return "{} on {}".format(self.name, self.starting_date)
