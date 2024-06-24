import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MenuItem } from "primeng/api";
import { Subject, map, take, takeUntil, tap } from "rxjs";
import { LayoutDataType } from "./types";
import { LanguageService } from "src/app/helpers/language.service";
import { environment } from "src/environments/environment.development";
import { ThemeService } from "src/app/helpers/theme.service";
import { AUTH_SERVICE } from "src/app/auth/types";
import { AuthService } from "src/app/auth/services/auth.service";

@Component({
  selector: "app-layout",
  templateUrl: "./app.layout.component.html",
  styleUrls: ["./app.layout.component.css"],
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public data$ = this.route.data;
  public signInState$ = this.authService.signInState$;
  public menus: MenuItem[] = [
    {
      label: this.languageService.instant("app.routing.myAccount"),
      icon: "pi pi-fw pi-user",
      routerLink: environment.app.routing.profile,
      routerLinkActiveOptions: {
        exact: true,
      },
    },
    {
      label: this.languageService.instant("app.routing.notifications"),
      icon: "pi pi-fw pi-bell",
      routerLink:
        environment.app.routing.profile +
        "/" +
        environment.app.routing.notifications,
      routerLinkActiveOptions: {
        exact: true,
      },
    },
    {
      label: this.languageService.instant("app.routing.logout"),
      icon: "pi pi-fw pi-sign-out",
      command: () => {
        this.confirmationService.confirm({
          header: "Déconnexion",
          message: this.languageService.instant("app.prompt.logout"),
          acceptLabel: this.languageService.instant("app.actions.continue"),
          rejectLabel: this.languageService.instant("app.actions.edit"),
          rejectButtonStyleClass: "p-button btn-dark-outline",
          acceptButtonStyleClass: "p-button btn-dark",
          accept: () => {
            this.authService.logout().pipe(take(1)).subscribe();
          },
        });
      },
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    public themeService: ThemeService,
    private confirmationService: ConfirmationService,
    @Inject(AUTH_SERVICE) private authService: AuthService
  ) {}

  ngOnInit(): void {}

  routeTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
