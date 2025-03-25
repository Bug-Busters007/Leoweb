import {Component, OnInit} from '@angular/core';
import {BanComponent} from "../ban/ban.component";
import {BanService} from "../../../services/ban.service";
import {NgFor} from "@angular/common";
import {IStudentBan} from "../../../models/studentBanModel";

@Component({
  selector: 'app-ban-list',
  standalone: true,

  templateUrl: './ban-list.component.html',
  styleUrl: './ban-list.component.css',
  imports: [
    BanComponent, NgFor
  ]
})
export class BanListComponent implements OnInit {
  banList?: IStudentBan[];
  constructor(private banService: BanService) {
  }

  async ngOnInit(): Promise<void> {
        this.banList = await this.banService.getAll();
        console.log(this.banList);
    }

}
