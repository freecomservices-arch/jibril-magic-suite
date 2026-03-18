from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class ScrapingSource(models.Model):
    """Source de scraping (Avito, Mubawab, Facebook, LinkedIn)"""
    
    name = models.CharField(max_length=100, unique=True)
    url = models.URLField()
    active = models.BooleanField(default=True)
    icon_emoji = models.CharField(max_length=10, default='🌐')
    
    # Configuration
    max_listings_per_scan = models.IntegerField(default=30)
    scan_delay_seconds = models.IntegerField(default=5)
    max_pages = models.IntegerField(default=3)
    
    # Méta
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({'Actif' if self.active else 'Inactif'})"


class Lead(models.Model):
    """Lead scrapé (Bien ou Personne)"""
    
    LEAD_TYPES = [
        ('Bien', 'Bien immobilier'),
        ('Personne', 'Personne / Contact'),
    ]
    
    LEAD_STATUSES = [
        ('Nouveau', 'Nouveau'),
        ('Qualifié', 'Qualifié'),
        ('Doublon', 'Doublon'),
        ('Assigné', 'Assigné'),
        ('Importé', 'Importé'),
    ]
    
    # Identification
    source = models.CharField(max_length=100)  # Avito.ma, Mubawab, Facebook, LinkedIn
    lead_type = models.CharField(max_length=20, choices=LEAD_TYPES, default='Bien')
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    
    # Détails
    price = models.CharField(max_length=50, default='-')
    price_numeric = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default='MAD')
    phone = models.CharField(max_length=50, default='-')
    email = models.EmailField(blank=True)
    url = models.URLField(blank=True)
    
    # Localisation (pour les biens)
    city = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)
    property_type = models.CharField(max_length=50, blank=True)  # Appartement, Villa, etc.
    area = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    bedrooms = models.IntegerField(null=True, blank=True)
    
    # Statut
    status = models.CharField(max_length=20, choices=LEAD_STATUSES, default='Nouveau')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_leads')
    
    # Méta
    scraped_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_leads')
    
    # Doublon detection
    is_duplicate = models.BooleanField(default=False)
    duplicate_of = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='duplicates')
    
    class Meta:
        ordering = ['-scraped_at']
        indexes = [
            models.Index(fields=['source', 'status']),
            models.Index(fields=['lead_type', 'status']),
            models.Index(fields=['city', 'status']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.source} ({self.status})"


class Contact(models.Model):
    """Contact importé depuis un lead Personne"""
    
    CONTACT_TYPES = [
        ('client', 'Client'),
        ('owner', 'Propriétaire'),
        ('agent', 'Agent'),
        ('investor', 'Investisseur'),
        ('other', 'Autre'),
    ]
    
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50)
    contact_type = models.CharField(max_length=20, choices=CONTACT_TYPES, default='client')
    
    # Origine
    source_lead = models.ForeignKey(Lead, on_delete=models.SET_NULL, null=True, blank=True)
    source_name = models.CharField(max_length=100, blank=True)  # Avito, Facebook, etc.
    source_url = models.URLField(blank=True)
    
    # Adresse
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    
    # Notes
    notes = models.TextField(blank=True)
    
    # Méta
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.phone}"


class Property(models.Model):
    """Propriété importée depuis un lead Bien"""
    
    PROPERTY_TYPES = [
        ('apartment', 'Appartement'),
        ('house', 'Maison'),
        ('villa', 'Villa'),
        ('land', 'Terrain'),
        ('commercial', 'Commercial'),
        ('office', 'Bureau'),
        ('riad', 'Riad'),
        ('farm', 'Ferme'),
    ]
    
    STATUS_CHOICES = [
        ('sale', 'À vendre'),
        ('rent', 'À louer'),
    ]
    
    # Identification
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    
    # Prix
    price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='MAD')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='sale')
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES)
    
    # Localisation
    location = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Détails
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.IntegerField(null=True, blank=True)
    area = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    floor = models.IntegerField(null=True, blank=True)
    
    # Source (scraping)
    source = models.CharField(max_length=50, blank=True)
    source_url = models.URLField(blank=True)
    scraped_at = models.DateTimeField(null=True, blank=True)
    
    # Médias
    images = models.JSONField(default=list, blank=True)
    main_image = models.URLField(blank=True)
    
    # Contact
    contact_name = models.CharField(max_length=100, blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    contact_email = models.EmailField(blank=True)
    
    # Méta
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['city', 'status']),
            models.Index(fields=['property_type', 'status']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.city} ({self.price} {self.currency})"


class SearchProfile(models.Model):
    """Profil de recherche enregistrable par les utilisateurs"""
    
    name = models.CharField(max_length=100)  # ex: "Client X - Casablanca"
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Critères de recherche
    cities = models.JSONField(default=list)  # ["Casablanca", "Rabat"]
    property_types = models.JSONField(default=list)  # ["apartment", "villa"]
    status = models.CharField(max_length=10, default='sale')
    
    # Filtres prix
    min_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    max_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Filtres surface
    min_area = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_area = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Filtres chambres
    min_bedrooms = models.IntegerField(null=True, blank=True)
    max_bedrooms = models.IntegerField(null=True, blank=True)
    
    # Sources
    sources = models.JSONField(default=list)  # ["avito", "mubawab", "facebook"]
    
    # Auto-scrape
    auto_scrape_enabled = models.BooleanField(default=False)
    auto_scrape_frequency = models.CharField(max_length=20, default='daily')  # daily, weekly
    auto_scrape_time = models.TimeField(default='03:00')
    auto_scrape_days = models.JSONField(default=list)  # [0,1,2,3,4,5,6] (Lun-Dim)
    
    # Méta
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.created_by.username}"


class ScrapeJob(models.Model):
    """Job de scraping (track l'exécution)"""
    
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('running', 'En cours'),
        ('completed', 'Terminé'),
        ('failed', 'Échoué'),
    ]
    
    source = models.CharField(max_length=50)
    url = models.URLField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    max_listings = models.IntegerField(default=30)
    listings_scraped = models.IntegerField(default=0)
    leads_created = models.IntegerField(default=0)
    
    # Résultats
    error_message = models.TextField(blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Méta
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.source} - {self.status} ({self.listings_scraped}/{self.max_listings})"


class UserSettings(models.Model):
    """Paramètres personnalisés par utilisateur"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    
    # Scraping
    default_max_listings = models.IntegerField(default=30)
    default_scan_delay = models.IntegerField(default=5)
    default_max_pages = models.IntegerField(default=3)
    
    # Villes prioritaires
    favorite_cities = models.JSONField(default=list)
    
    # Notifications
    notify_new_leads = models.BooleanField(default=True)
    notify_duplicates = models.BooleanField(default=True)
    notification_email = models.EmailField(blank=True)
    
    # Export
    default_export_format = models.CharField(max_length=20, default='csv')  # csv, excel, json
    
    # Méta
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['user']
    
    def __str__(self):
        return f"Paramètres de {self.user.username}"
