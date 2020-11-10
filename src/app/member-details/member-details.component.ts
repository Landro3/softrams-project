import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

// This interface may be useful in the times ahead...
interface Member {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member = null;
  memberForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    jobTitle: ['', Validators.required],
    team: ['', Validators.required],
    status: ['', Validators.required]
  });
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  loadingTeams = false;
  isEditing = false;

  constructor(
    private fb: FormBuilder, 
    private appService: AppService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /*
   * Lifecycle functions
  */
  ngOnInit() {
    // Check if component will be used for editing
    this.route.params.subscribe(
      (params: Params) => {
        if (params['id'] === 'new') {
          this.isEditing = false;
          this.memberModel = null;
          this.memberForm.reset();
        } else {
          // If used for editing, make sure id is valid
          this.appService.getMembers().subscribe(
            (members: Member[]) => {
              const editingMember = members.find(member => member.id === +params['id']);
              if (editingMember) {
                this.isEditing = true;
                this.memberForm.patchValue({ ...editingMember })
                this.memberModel = editingMember;
              } else {
                this.router.navigate(['/member-details/new']);
              }
            }
          )
        }
      }
    )

    // Get list of teams from db with loading
    this.loadingTeams = true;
    this.appService.getTeams().subscribe(teams => {
      this.teams = teams
      this.loadingTeams = false;
    })
  }

  ngOnChanges() {}

  goToMembersPage() {
    this.router.navigate(['/members']);
  }

  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    if (!this.isEditing) {
      this.appService.addMember(form.value).subscribe(
        () => { this.router.navigate(['/members']); }
      );
    } else {
      this.memberModel = {
        id: this.memberModel.id,
        ...form.value
      }
      this.appService.updateMember(this.memberModel).subscribe(
        () => { this.router.navigate(['./members']); }
      );
    }
  }
}
