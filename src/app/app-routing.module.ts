import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {HomeComponent} from './home/home.component';
import {FilterDialogComponent} from './filter-dialog/filter-dialog.component';
import {UploadComponent} from './upload/upload.component';
import {AdminComponent} from './admin/admin.component';
import {DetailsComponent} from './details/details.component';
import {AddConceptComponent} from './add-concept/add-concept.component';
import {InfoComponent} from './info/info.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {ListComponent} from './list/list.component';

const routes: Routes = [
  {path: 'auth/:back-to', component: AuthComponent},
  {path: 'home', component: HomeComponent},
  {path: 'filter', component: FilterDialogComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'details', component: DetailsComponent},
  {path: 'volunteer', component: AddConceptComponent},
  {path: 'info/:id', component: InfoComponent},
  {path: 'play-lists', component: PlaylistComponent},
  {path: 'list/:title', component: ListComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
