import { ProductModelPipe } from './product-model.pipe';

describe('ProductModelPipe', () => {
  it('create an instance', () => {
    const pipe = new ProductModelPipe();
    expect(pipe).toBeTruthy();
  });
});
