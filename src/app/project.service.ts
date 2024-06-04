import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  url = 'http://localhost:3000/project';
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.url)
  }

  create(name: any, startDate: any, teamSize: any, price: any, description: any, image: any = '') {
    return this.http.post('http://localhost:3000/project', {
      name,
      startDate,
      teamSize,
      price,
      description,
      image
    })
  }

  edit(id: any, name: any, startDate: any, teamSize: any, price: any, description: any, image: any = '') {
    return this.http.post(`http://localhost:3000/project/${id}`, {
      name,
      startDate,
      teamSize,
      price,
      description,
      image
    })
  }

  delete(id: any) {
    return this.http.delete(`http://localhost:3000/project/${id}`)
  }
}
