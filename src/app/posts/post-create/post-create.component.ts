import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from "../post.model";
import { AuthService } from 'src/app/auth/auth.service';


interface SellType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
 selectedOption="";
 enteredContent="";
 imagePreview;
 post: Post;
 isLoading= false;
 form: FormGroup;

 enteredPrice="";
 price:string;

 private mode="create";
 private postId:string;
 private authStatusSub: Subscription;
 
 
 sellType : SellType[] = [
    {value: 'Cars-0', viewValue: 'Cars'},
    {value: 'Apartments-1', viewValue: 'Apartments'},
    {value: 'Mobile-2', viewValue: 'Mobile'},
    {value: 'Furniture-3', viewValue: 'Furniture'}
  ];
 
  
  

  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) { }

  onImagePicked(event : Event){
     const file = (event.target as HTMLInputElement).files[0];
     this.form.patchValue({image:file});
     this.form.get("image").updateValueAndValidity();
     const reader =new FileReader();
     reader.onload = () => {
       this.imagePreview = reader.result;
     };
     reader.readAsDataURL(file);
    
  }

  onSavePost(){
    if (this.form.invalid){
      return
    }
    this.isLoading= true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.option,this.form.value.content,this.form.value.price, this.form.value.image);
    } else{
      this.postsService.updatePost(
        this.postId,
        this.form.value.option,
        this.form.value.content,
        this.form.value.price,
        this.form.value.image
        );
    }
    
    this.form.reset();
  
  }

  ngOnInit() {
    this.authStatusSub = this.authService
     .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading= false;
      });
    this.form = new FormGroup ({
      'option': new FormControl(null,{
        validators: [Validators.required]
      }),
      'content': new FormControl(null,{
        validators: [Validators.required]
      }),
      'price': new FormControl(null,{
        validators: [Validators.required]
      }),
      'image': new FormControl(null,{
        validators: [Validators.required]
      })

    });
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
       if(paramMap.has("postId")){
         this.mode="edit";
         this.postId = paramMap.get("postId");
         this.isLoading = true;
         this.postsService.getPost(this.postId).subscribe(postData =>{
          this.isLoading = false;
           this.post = {id: postData._id, option: postData.option, price: postData.price, content: postData.content, imagePath: postData.imagePath, creator:postData.creator};
           this.form.setValue({
             'option': this.post.option,
             'content': this.post.content,
             'price': this.post.price,
             "image": this.post.imagePath
             
           })
         });
       }
       else{
         this.mode ="create";
         this.postId=null;
       }
    });
  }

  ngOnDestroy(){
     this.authStatusSub.unsubscribe();
  }

}
