import {
  Component,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
  input,
  effect,
  computed,
  // linkedSignal,
  // output,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  imports: [CommonModule],
  templateUrl: './counter.component.html',
})
export class CounterComponent
  implements /*OnChanges,*/ OnInit, AfterViewInit, OnDestroy
{
  $duration = input.required<number>({ alias: 'duration' });
  $doubleDuration = computed(() => this.$duration() * 2);
  $message = model.required<string>({ alias: 'message' });
  // $newMessage = linkedSignal(() => this.$message());
  $counter = signal(0);
  counterRef: number | undefined;
  // changeMessage = output<string>();

  constructor() {
    // NO ASYNC
    // before render
    // una vez
    console.log('constructor');
    console.log('-'.repeat(10));

    effect(() => {
      this.$duration();
      this.doSomething();
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // before and during render
  //   console.log('ngOnChanges');
  //   console.log('-'.repeat(10));
  //   console.log(changes);
  //   const duration = changes['duration'];
  //   if (duration && duration.currentValue !== duration.previousValue) {
  //     this.doSomething();
  //   }
  // }

  ngOnInit() {
    // after render
    // una vez
    // async, then, subs
    console.log('ngOnInit');
    console.log('-'.repeat(10));
    console.log('duration =>', this.$duration());
    console.log('message =>', this.$message());
    this.counterRef = window.setInterval(() => {
      console.log('run interval');
      this.$counter.update(statePrev => statePrev + 1);
    }, 1000);
  }

  ngAfterViewInit() {
    // after render
    // hijos ya fueron pintandos
    console.log('ngAfterViewInit');
    console.log('-'.repeat(10));
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    console.log('-'.repeat(10));
    window.clearInterval(this.counterRef);
  }

  doSomething() {
    console.log('change duration');
    // async
  }

  setMessage() {
    this.$message.set('Adios');
    // this.$newMessage.set('Adios');
    // this.changeMessage.emit(this.$newMessage());
  }
}
