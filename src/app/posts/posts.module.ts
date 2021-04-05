import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PostListComponent } from './post-list/post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { AngularMaterialModule } from "../angular-material.module";




@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostsModule {

}