import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  url = 'http://localhost:3000/task';
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.url)
  }

  getOne(id: string) {
    return this.http.get(this.url + '/' + id)
  }

  create(data: any) {
    return this.http.post(this.url, data)
  }

  edit(id: string, data: any) {
    return this.http.put(this.url + '/' + id, data)
  }

  del(id: string) {
    return this.http.delete(this.url + '/' + id)
  }
}
