import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { Subject, takeUntil, tap } from "rxjs";
import { AuthService } from "../auth/services/auth.service";
import { AUTH_SERVICE } from "../auth/types";
import { ActivatedRoute, Router } from "@angular/router";
import { LanguageService } from "src/app/helpers/language.service";

@Component({
  selector: "app-layout",
  templateUrl: "./app.layout.component.html",
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public userState$ = this.authService.userState$.pipe(
    takeUntil(this.destroy$)
  );
  @Input() public data!: any;
  @Input() public routes: MenuItem[] = [];
  @Input() public title!: string;
  @Input() public description!: string;

  constructor(
    @Inject(AUTH_SERVICE) private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private languageService: LanguageService
  ) {
    this.route.data.pipe(tap((state) => (this.data = state))).subscribe();
  }

  ngOnInit(): void { }

  onSignOut() {
    this.router.navigate(["auth", "sign-out"]);
  }

  confirm(event: Event) {
    if (event?.target)
      this.confirmationService.confirm({
        target: event.target,
        header: this.languageService.instant("app.actions.logout"),
        message: this.languageService.instant("app.prompt.logout"),
        acceptLabel: this.languageService.instant("app.actions.logout"),
        rejectLabel: this.languageService.instant("app.actions.cancel"),
        acceptButtonStyleClass:
          "p-button-text p-button-outlined p-button-danger",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.router.navigate(["auth", "sign-out"]);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
