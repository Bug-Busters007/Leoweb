import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { BlogService } from '../../../services/blog.service';
import { RefreshService } from '../../../services/refresh.service';
import { BlogCategory } from '../../../models/blogCategoryModel';
import { BlogEntry } from '../../../models/blogEntryModel';

@Component({
  selector: 'app-blog-entry-creator',
  standalone: true,
  templateUrl: './blog-entry-creator.component.html',
  styleUrl: './blog-entry-creator.component.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatChipsModule,
  ],
})
export class BlogEntryCreatorComponent implements OnInit {
  @Input() editEntry: BlogEntry | null = null;
  @Output() saved = new EventEmitter<void>();

  categories: BlogCategory[] = [];
  links: string[] = [];
  base64Images: string[] = [];
  isLinear = false;

  constructor(
    private blogService: BlogService,
    private refreshService: RefreshService,
    private _formBuilder: FormBuilder,
  ) {}

  async ngOnInit() {
    const result = await this.blogService.getCategories();
    this.categories = result ?? [];

    if (this.editEntry) {
      this.patchFormFromEntry(this.editEntry);
    }
  }

  titleFormGroup = this._formBuilder.group({
    title: ['', Validators.required],
  });

  descriptionFormGroup = this._formBuilder.group({
    description: ['', Validators.required],
  });

  categoryFormGroup = this._formBuilder.group({
    category: ['', Validators.required],
  });

  contentFormGroup = this._formBuilder.group({
    text: [''],
  });

  settingsFormGroup = this._formBuilder.group({
    commentsAllowed: [true],
  });

  addLink(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.links.push(value);
    }
    event.chipInput!.clear();
  }

  removeLink(link: string): void {
    const index = this.links.indexOf(link);
    if (index >= 0) {
      this.links.splice(index, 1);
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // Remove data:image/...;base64, prefix
        this.base64Images.push(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    this.base64Images.splice(index, 1);
  }

  async createEntry(stepper: any): Promise<void> {
    const entryData = {
      title: this.titleFormGroup.value.title!,
      description: this.descriptionFormGroup.value.description!,
      category: this.categoryFormGroup.value.category!,
      content: {
        text: this.contentFormGroup.value.text || '',
        links: this.links,
        images: this.base64Images,
      },
      commentsAllowed: this.settingsFormGroup.value.commentsAllowed ?? true,
    };

    await this.blogService.ensureBlogUser();

    const updatePayload = this.editEntry
      ? {
          ...this.editEntry,
          ...entryData,
          content: { ...entryData.content },
        }
      : null;

    const request$ = this.editEntry
      ? this.blogService.updateEntry(this.editEntry.id, updatePayload!)
      : this.blogService.createEntry(entryData);

    request$.subscribe({
      next: (response) => {
        console.log(this.editEntry ? 'Blog entry updated!' : 'Blog entry created!', response);
        this.refreshService.triggerRefresh();
        this.saved.emit();
        alert(this.editEntry ? 'Blog-Eintrag erfolgreich bearbeitet!' : 'Blog-Eintrag erfolgreich erstellt!');
        this.reset(stepper);
      },
      error: (err) => {
        console.error(this.editEntry ? 'Error updating blog entry:' : 'Error creating blog entry:', err);
        const message = err.error?.message || err.error || err.statusText || 'Unbekannter Fehler';
        alert(`Fehler beim ${this.editEntry ? 'Bearbeiten' : 'Erstellen'} des Blog-Eintrags (${err.status}): ${message}`);
      },
    });
  }

  reset(stepper: any): void {
    stepper.reset();
    this.titleFormGroup.reset({ title: '' });
    this.descriptionFormGroup.reset({ description: '' });
    this.categoryFormGroup.reset({ category: '' });
    this.contentFormGroup.reset({ text: '' });
    this.settingsFormGroup.reset({ commentsAllowed: true });
    this.links = [];
    this.base64Images = [];
  }

  private patchFormFromEntry(entry: BlogEntry): void {
    this.titleFormGroup.patchValue({ title: entry.title });
    this.descriptionFormGroup.patchValue({ description: entry.description });
    this.categoryFormGroup.patchValue({ category: entry.category });
    this.contentFormGroup.patchValue({ text: entry.content?.text ?? '' });
    this.settingsFormGroup.patchValue({ commentsAllowed: entry.commentsAllowed });
    this.links = [...(entry.content?.links ?? [])];
    this.base64Images = [...(entry.content?.images ?? [])];
  }
}

