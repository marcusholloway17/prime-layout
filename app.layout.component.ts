import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Subject, map, takeUntil, tap } from "rxjs";
import { LayoutDataType } from "./types";
import { LanguageService } from "src/app/helpers/language.service";
import { environment } from "src/environments/environment.development";
import { ThemeService } from "src/app/helpers/theme.service";

@Component({
  selector: "app-layout",
  templateUrl: "./app.layout.component.html",
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
