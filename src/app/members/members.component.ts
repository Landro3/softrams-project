import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members = [];

  constructor(public appService: AppService, private router: Router) {}

  ngOnInit() {
    this.appService.getMembers().subscribe(members => (this.members = members));
  }

  goToAddMemberForm() {
    this.router.navigate(['/member-details', 'new']);
  }

  editMemberById(id: number) {
    this.router.navigate(['/member-details', id]);
  }

  deleteMemberById(id: number) {
    const deleteConfirmed = confirm('Are you sure you want to delete the member with id ' + id + '?');
    if (deleteConfirmed) {
      this.appService.deleteMember(id).subscribe(
        () => {
          this.appService.getMembers().subscribe(
            members => this.members = members
          );
        }
      );
    }
  }
}
