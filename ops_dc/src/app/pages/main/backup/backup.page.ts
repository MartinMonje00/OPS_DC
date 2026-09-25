import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { downloadOutline } from 'ionicons/icons';
import { BackupService, DatabaseBackup } from 'src/app/services/backup';
import { UtilsService } from 'src/app/services/utils';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { SharedModule } from 'src/app/shared/shared-module';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
  standalone: true,
  imports: [
    CommonModule, SharedModule, IonContent, IonSpinner, IonIcon,
    FooterComponent
  ]
})
export class BackupPage implements OnInit {
  private backupSvc = inject(BackupService);
  private utilsSvc = inject(UtilsService);

  backups = signal<DatabaseBackup[]>([]);
  isGenerating = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  private showToast(message: string, color: 'success' | 'danger') {
    this.utilsSvc.presentToast({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
  }

  constructor() {
    addIcons({downloadOutline})
  }

  ngOnInit() {
    this.loadBackups();
  }

  loadBackups() {
    this.isLoading.set(true);
    this.backupSvc.getBackups().subscribe({
      next: (data) => {
        this.backups.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener los respaldos:', err);
        this.showToast('Error al consultar la lista de respaldos', 'danger');
        this.isLoading.set(false);
      }
    });
  }

  async generateBackup() {
    const confirmed = await this.utilsSvc.presentAlert({
      header: 'Confirmar respaldo',
      message: '¿Estas seguro de que deseas generar una nueva copia de seguridad? Este proceso consumira recursos del servidor.',
      confirmText: 'Sí, generar',
      cancelText: 'Cancelar'
    });

    if (!confirmed) return;

    this.isGenerating.set(true);
    this.backupSvc.generateBackup().subscribe({
      next: () => {
        this.isGenerating.set(true);
        this.showToast('Copia de seguridad generada exitosamente', 'success');
        this.loadBackups();
        this.isGenerating.set(false);
      },
      error: (err) => {
        console.error('Error al crear la copia de seguridad:', err);
        this.showToast('Error al generar la copia de seguridad', 'danger');
        this.isGenerating.set(false);
      }
    });
  }

  downloadBackup(backup: DatabaseBackup) {
    this.backupSvc.downloadBackup(backup.filename).subscribe({
      next: (blobData) => {
        const blobUrl = window.URL.createObjectURL(blobData);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = backup.filename;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (err) => {
        console.error('Error al descargar el archivo:', err);
        this.showToast('Error al descargar el archivo de respaldo', 'danger');
      }
    });
  }
}
