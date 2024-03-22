import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Subject, interval, map, switchMap, takeUntil, tap } from "rxjs";
import { LayoutDataType } from "./types";
import { AuthService } from "../auth/services/auth.service";
import { AUTH_SERVICE } from "../auth/types";
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
  public data!: LayoutDataType;
  public menuItems: MenuItem[] = [
    {
      label: "Apps",
      routerLink: ["/"],
    },
  ];

  public statisticRequestCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(AUTH_SERVICE) private authService: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        map((data) => {
          return {
            ...data,
            menuItems: this.menuItems,
            popupMenuItems: [
              {
                label: this.languageService.instant("sign-out.label"),
                icon: "pi pi-fw pi-sign-out",
                command: () => {
                  this.router.navigate(["/auth/sign-out"]);
                },
              },
            ],
          };
        }),
        tap((data) => {
          this.data = data as LayoutDataType;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
