import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sample-app';
  // selectedGroup: FieldGroup | null = null;

  // constructor(private formBuilderService: FormBuilderService) {}

  // onSelectGroup(group: FieldGroup): void {
  //   this.selectedGroup = group;
  // }

  // onElementsUpdated(updatedElements: FormElement[]): void {
  //   if (this.selectedGroup) {
  //     this.selectedGroup.elements = updatedElements;
  //     this.formBuilderService.updateFieldGroup(this.selectedGroup.id, this.selectedGroup);
  //   }
  // }
  emailPattern: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
  fieldGroups = [
    { id: '1', name: 'AMC Reports' },
    { id: '2', name: 'HVAC Repair' },
    { id: '3', name: 'AMC Yearly' },
    { id: '4', name: 'AMC Installations - Tier 3' }
  ];
  activeGroup = '1';
  elementsList = [
    { id: 'single_text', label: 'Single Line Text' },
    { id: 'multi_text', label: 'Multi Line Text' },
    { id: 'email', label: 'Email', validations: { email: true, required: true } },
    { id: 'integer', label: 'Integer' },
    { id: 'date', label: 'Date' },
    { id: 'time', label: 'Time' },
    { id: 'datetime', label: 'Date & Time' },
    { id: 'single_select', label: 'Single Selection' },
    { id: 'multi_select', label: 'Multi Selection' },
    { id: 'dropdown', label: 'Dropdown' },
    { id: 'upload', label: 'Upload' }
  ];
  fields: any[] = [];
  isPreviewOpen = false;
  previewContent: any = null;

  setActiveGroup(groupId: string) {
    this.activeGroup = groupId;
  }

  getActiveGroupName() {
    return this.fieldGroups.find(group => group.id === this.activeGroup)?.name || '';
  }

  addGroup() {
    const name = prompt('Enter new group name:');
    if (name) {
      this.fieldGroups.push({ id: Date.now().toString(), name });
    }
  }

  onDragStart(event: DragEvent, element: any) {
    event.dataTransfer?.setData('text', JSON.stringify(element));
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const element = JSON.parse(event.dataTransfer?.getData('text') || '{}');
    this.fields.push({ id: Date.now().toString(), type: element.id, label: element.label, value: '' });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileUpload(fieldId: string, event: any) {
    const file = event.target.files[0];
    const field = this.fields.find(f => f.id === fieldId);
    if (field && file) {
      field.fileName = file.name;
    }
  }

  // Method to handle editing a field's label
  onFieldLabelChange(fieldId: string, newLabel: string) {
    const field = this.fields.find(f => f.id === fieldId);
    if (field) {
      field.label = newLabel;
    }
  }

  // Method to handle changes to input field values (for text, number, etc.)
  onFieldValueChange(fieldId: string, newValue: string) {
    const field = this.fields.find(f => f.id === fieldId);
    if (field) {
      field.value = newValue;
    }
  }

  // Import and Preview Configuration
  importConfiguration(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const config = JSON.parse(reader.result as string);

          // Show the preview modal with parsed JSON content
          this.previewContent = config;
          this.isPreviewOpen = true;

        } catch (error) {
          alert('Error importing configuration: ' + error);
        }
      };

      reader.readAsText(file);
    }
  }

  // Close the preview modal
  closePreview() {
    this.fieldGroups = this.previewContent.fieldGroups || [];
    this.fields = this.previewContent.fields || [];
    this.isPreviewOpen = false;
    this.previewContent = null;
  }

  // Apply the imported configuration
  applyImport() {
    if (this.previewContent) {
      // Update fieldGroups and fields with the imported data
      // this.fieldGroups = this.previewContent.fieldGroups || [];
      // this.fields = this.previewContent.fields || [];

      alert('Configuration imported successfully!');
      this.isPreviewOpen = false;
      this.previewContent = null; // Close the modal after applying the import
    }
  }
  exportConfiguration() {
    const config = {
      fieldGroups: this.fieldGroups,
      fields: this.fields
    };
  
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'form_configuration.json';
    link.click();
  }
  
}
