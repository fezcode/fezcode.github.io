import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CoralColorPicker from './CoralColorPicker';

const palette = {
  pigment: '#ef626d',
  tip: '#ff8186',
  fold: '#713c48',
  background: '#222326',
};

function ControlledPicker({ initial = palette, onChange }) {
  const [colors, setColors] = useState(initial);
  return (
    <CoralColorPicker
      colors={colors}
      onChange={(key, hex) => {
        setColors((previous) => ({ ...previous, [key]: hex }));
        onChange(key, hex);
      }}
    />
  );
}

const openMixer = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Mix custom colors' }));

test('hex drafts commit on Enter and reject invalid or incomplete colors', () => {
  const onChange = vi.fn();
  render(<ControlledPicker onChange={onChange} />);
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  openMixer();
  const input = screen.getByRole('textbox', { name: 'Petals hex color' });
  fireEvent.change(input, { target: { value: '#123' } });
  fireEvent.change(input, { target: { value: '#123456' } });
  expect(onChange).not.toHaveBeenCalled();
  expect(input).toHaveValue('#123456');
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onChange).toHaveBeenLastCalledWith('pigment', '#123456');
  onChange.mockClear();
  fireEvent.change(input, { target: { value: '#12' } });
  fireEvent.blur(input);
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('Use 3 or 6 hex digits');
  fireEvent.keyDown(input, { key: 'Escape' });
  expect(input).toHaveValue('#123456');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('editing a different color role only changes that role', () => {
  const onChange = vi.fn();
  render(<ControlledPicker onChange={onChange} />);
  openMixer();
  fireEvent.click(screen.getByRole('button', { name: 'Edges', exact: true }));
  const input = screen.getByRole('textbox', { name: 'Edges hex color' });
  fireEvent.change(input, { target: { value: 'abc' } });
  fireEvent.blur(input);
  expect(onChange).toHaveBeenLastCalledWith('tip', '#aabbcc');
  expect(input).toHaveValue('#AABBCC');
  fireEvent.click(screen.getByRole('button', { name: 'Petals', exact: true }));
  expect(screen.getByRole('textbox', { name: 'Petals hex color' })).toHaveValue(
    '#EF626D',
  );
});

test('hue and saturation survive black until brightness is restored', () => {
  const onChange = vi.fn();
  render(
    <ControlledPicker
      initial={{ ...palette, pigment: '#000000' }}
      onChange={onChange}
    />,
  );
  openMixer();
  fireEvent.change(screen.getByRole('slider', { name: /^Hue/ }), {
    target: { value: '200' },
  });
  fireEvent.change(screen.getByRole('slider', { name: /^Saturation/ }), {
    target: { value: '100' },
  });
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole('slider', { name: /^Brightness/ }), {
    target: { value: '100' },
  });
  expect(onChange).toHaveBeenLastCalledWith('pigment', '#00aaff');
  expect(screen.getByRole('slider', { name: /^Hue/ })).toHaveValue('200');
});

test('external presets replace color drafts and update the mixer', () => {
  const onChange = vi.fn();
  const { rerender } = render(
    <CoralColorPicker colors={palette} onChange={onChange} />,
  );
  openMixer();
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: '#badhex' },
  });
  rerender(
    <CoralColorPicker
      colors={{ ...palette, pigment: '#0000ff' }}
      onChange={onChange}
    />,
  );
  expect(screen.getByRole('textbox')).toHaveValue('#0000FF');
  expect(screen.getByRole('slider', { name: /^Hue/ })).toHaveValue('240');
  expect(onChange).not.toHaveBeenCalled();
});

test('the color field supports keyboard changes without pointer input', () => {
  const onChange = vi.fn();
  render(
    <ControlledPicker
      initial={{ ...palette, pigment: '#ff0000' }}
      onChange={onChange}
    />,
  );
  openMixer();
  fireEvent.keyDown(
    screen.getByRole('group', {
      name: 'Petals saturation and brightness field',
    }),
    { key: 'ArrowLeft', shiftKey: true },
  );
  expect(onChange).toHaveBeenLastCalledWith('pigment', '#ff1919');
});
