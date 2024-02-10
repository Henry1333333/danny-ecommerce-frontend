import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudinaryResponse } from '../model/cloudinary';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private uploadUrl = 'http://localhost:8070/cloudinary/upload';
  constructor(private http: HttpClient) { }

  uploadImage(image: File): Observable<CloudinaryResponse> {
    const formData = new FormData();
    formData.append('multipartFile', image);

    return this.http.post<CloudinaryResponse>(this.uploadUrl, formData);
  }
  
}
