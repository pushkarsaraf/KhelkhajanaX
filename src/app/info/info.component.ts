import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  contact = false;
  social = false;
  home = false;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        if (params.id === '0') {
          this.contact = true;
          this.social = false;
          this.home = false;
        } else if (params.id === '1') {
          this.social = true;
          this.home = false;
          this.contact = false;
        } else if (params.id === '2') {
          this.home = true;
          this.social = false;
          this.contact = false;
        }
      }
    );
  }

  setBools(path: string) {

  }

  goto(url: string) {
    window.location.href = url;
  }
}
