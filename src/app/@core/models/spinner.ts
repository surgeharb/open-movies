export class Spinner {
  private mode: String;
  private color: String;
  private value: Number;
  private loading: Boolean;

  constructor(mode?: String, color?: String, value?: Number, loading?: Boolean) {
    this.mode = mode || 'indeterminate';
    this.color = color || 'primary';
    this.loading = loading || false;
    this.value = value || 0;
  }

  public get $mode(): String {
    return this.mode;
  }

  public set $mode(value: String) {
    this.mode = value;
  }

  public get $color(): String {
    return this.color;
  }

  public set $color(value: String) {
    this.color = value;
  }

  public get $value(): Number {
    return this.value;
  }

  public set $value(value: Number) {
    this.value = value;
  }

  public get $loading(): Boolean {
    return this.loading;
  }

  public set $loading(value: Boolean) {
    this.loading = value;
  }

}
