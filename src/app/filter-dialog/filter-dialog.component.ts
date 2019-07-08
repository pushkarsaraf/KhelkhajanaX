import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  subjects = [
    'अच्छी आदतें और शारीरिक स्वास्थ्य',
    'शिक्षा-पूरक क्षमताएं - ध्यान देना; सहभाग लेना',
    'भाषा', 'गणित',
    'निरीक्षण-विश्लेषण-तर्क-निर्णय-कल्पना क्षमता',
    'अभिव्यक्ती',
    'सामान्यज्ञान – स्व;परिवार; गांव; जिला',
    'सहकार्य-सामुहिकता',
    'उद्योगशीलता'
  ];
  subject: string;

  mathConcepts = [
    'गणित और व्यवहार का संबंध समझना',
    'गिनती',
    'संख्या परिचय और गिनती',
    'मुलभुत गणितीय क्रिया के अपने खुदके तरीके बनाना',
    'गणितीय क्रिया से संबंधित परिभाषा और चिन्ह समझना',
    'जोड़ना',
    'घटाना',
    'गुना',
    'भाग',
    'वर्गीकरण',
    'मुलभुत भुमितीय आकार समझना और उनकी समानताएं और अंतर बता पाना',
    'आकार और संख्या से संबंधित पैटर्न देख पाना'
  ];
  math: string;

  englishConcepts = [
    'सुनना-बोलना',
    'वाचन पूर्वतैयारी',
    'अक्षर परिचय',
    'शब्दवाचन',
    'शब्दसंग्रह/शब्दार्थ समझना',
    'पढ़कर समझना',
    'लेखन पूर्वतैयारी',
    'देखकर लिखना',
    'सुनकर लिखना',
    'समझकर लिखना',
    'लिखकर व्यक्त होना'

  ];
  english: string;
  kg: boolean;
  class: number;
  activityType = ['गतिविधि', 'वर्कशीट', 'पाठ योजना'];
  age: number;
  interest: number;
  rating = 0;
  ratingAttn: number;
  ratingInterest: number;
  @Input() sadhan = 0;
  @Output() sadhanChange = new EventEmitter<number>();
  // filterForm = new FormGroup();
  constructor() {
  }

  ngOnInit() {
  }


  procesSadhan(i: number) {
    this.sadhan = i;
    this.sadhanChange.emit(this.sadhan);
  }
}
