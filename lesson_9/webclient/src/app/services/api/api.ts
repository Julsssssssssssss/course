import {Injectable} from '@angular/core';

export abstract class Api {
  public abstract getUrl(): string;
}
