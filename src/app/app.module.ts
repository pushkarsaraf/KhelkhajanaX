import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthComponent} from './auth/auth.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {environment} from '../environments/environment';
import {
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatNativeDateModule,
  MatOptionModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import {HomeComponent} from './home/home.component';
import {TopBarComponent} from './top-bar/top-bar.component';
import {FilterDialogComponent} from './filter-dialog/filter-dialog.component';
import {UploadComponent} from './upload/upload.component';
import {AddConceptComponent} from './add-concept/add-concept.component';
import { AdminComponent } from './admin/admin.component';
import { DetailsComponent } from './details/details.component';
import { InfoComponent } from './info/info.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ListComponent } from './list/list.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    TopBarComponent,
    FilterDialogComponent,
    UploadComponent,
    AddConceptComponent,
    AdminComponent,
    DetailsComponent,
    InfoComponent,
    PlaylistComponent,
    ListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatChipsModule,
    MatRadioModule,
    MatSliderModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatGridListModule,
    MatDialogModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBottomSheetModule,
    MatAutocompleteModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    AddConceptComponent,
    DetailsComponent,
    PlaylistComponent
  ]
})
export class AppModule { }
