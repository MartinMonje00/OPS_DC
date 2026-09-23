import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data';
import { UtilsService } from 'src/app/services/utils';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CreateContactComponent } from 'src/app/shared/components/modals/create-contact/create-contact.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
  standalone: true,
  imports: [
    IonContent, HeaderComponent, FooterComponent
  ]
})
export class ContactsPage implements OnInit, ViewWillEnter {
  private dataSvc = inject(DataService);
  private utilsSvc = inject(UtilsService);

  contacts = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  selectedCategory = signal<string>('cliente');

  readonly allCategories = [
    { key: 'cliente', label: 'Clientes' },
    { key: 'proveedor', label: 'Proveedores' },
    { key: 'interno', label: 'Internos' },
    { key: 'gobierno', label: 'Gobierno' },
    { key: 'otro', label: 'Otros' }
  ];

  visibleCategories = computed(() => {
    const currentContacts = this.contacts();
    return this.allCategories.filter(cat =>
      currentContacts.some(c => c.type?.toLowerCase() === cat.key.toLowerCase())
    );
  });

  filteredContacts = computed(() => {
    const category = this.selectedCategory();
    return this.contacts().filter(c => c.type?.toLowerCase() === category.toLowerCase());
  });

  ngOnInit() {
    this.getContacts();
  }

  ionViewWillEnter() {
    this.getContacts();
  }

  getContacts() {
    this.isLoading.set(true);
    this.dataSvc.getContacts().subscribe({
      next: (data) => {
        this.contacts.set(data || []);
        this.isLoading.set(false);

        const available = this.visibleCategories();
        if (available.length > 0 && !available.some(c => c.key === this.selectedCategory())) {
          this.selectedCategory.set(available[0].key);
        }
      },
      error: (err) => {
        console.error('Error al obtener contactos:', err);
        this.isLoading.set(false);
      }
    });
  }

  countByCategory(categoryKey: string): number {
    return this.contacts().filter(c => c.type?.toLowerCase() === categoryKey.toLowerCase()).length;
  }

  async openContactModal(contactData?: any) {
    const resData = await this.utilsSvc.presentModal({
      component: CreateContactComponent,
      cssClass: 'custom-edit-user-modal',
      componentProps: { contactData }
    });

    if (resData?.success || resData?.code === 'ROW_INSERT_OK' || resData?.data) {
      this.getContacts();
    }
  }

  deleteContact(id: string) {
    this.dataSvc.deleteContact(id).subscribe({
      next: () => {
        this.utilsSvc.presentToast({
          message: 'Contacto eliminado exitosamente',
          duration: 2000,
          color: 'success'
        });
        this.getContacts();
      },
      error: (err) => console.error('Error al eliminar el contacto:', err)
    });
  }
}
