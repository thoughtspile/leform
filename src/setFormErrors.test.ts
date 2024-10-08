import { setFormErrors } from "./setFormErrors";
import { it, expect, describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { customValidations } from './customValidations';

function createForm(html: string) {
    const form = document.createElement('form');
    form.innerHTML = html + '<button id="submit">submit</button>';
    document.body.appendChild(form);
    return form;
}

const getControl = (name: string) => document.getElementsByName(name)[0] as HTMLInputElement;

it('can set errors', () => {
    const form = createForm(`
        <input name="foo">
        <input name="bar">
        <input name="baz">
    `);
    setFormErrors(form, {
        foo: 'bad foo',
        bar: 'bad bar'
    });
    expect(getControl('foo')).toBeInvalid();
    expect(getControl('foo').validationMessage).toBe('bad foo');
    expect(getControl('bar')).toBeInvalid();
    expect(getControl('bar').validationMessage).toBe('bad bar');
    expect(getControl('baz')).not.toBeInvalid();
});

it('ignores non-existent fields', () => {
    const form = createForm(`
        <input name="foo">
    `);
    expect(() => setFormErrors(form, { blah: 'blah' })).not.toThrow();
});

it('works with customValidations', () => {
    const form = createForm(`
        <input name="foo">
    `);
    customValidations(form, { foo: () => false });
    setFormErrors(form, { foo: 'bad foo' });
    expect(getControl('foo').validationMessage).toBe('bad foo');
});

it('can clear error via API', () => {
    const form = createForm(`
        <input name="foo">
        <input name="bar">
    `);
    setFormErrors(form, { foo: 'bad foo', bar: 'bad bar' });
    setFormErrors(form, { foo: 'bad foo', bar: false });
    expect(getControl('foo').validationMessage).toBe('bad foo');
    expect(getControl('bar')).not.toBeInvalid();
});
