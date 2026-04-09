<script setup lang="ts">
import { computed, nextTick, ref, useId, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    suffix: string;
    inputId?: string;
    minWidthPx?: number;
  }>(),
  {
    inputId: undefined,
    minWidthPx: 72,
  },
);

const modelValue = defineModel<number>({ required: true });

const fallbackInputId = useId();
const labelId = useId();
const inputId = computed(() => props.inputId ?? fallbackInputId);

const measureRef = ref<HTMLSpanElement | null>(null);
const shellWidthPx = ref(props.minWidthPx);

const shellHorizontalChromePx = 26;

const integerDigits = computed(() => String(modelValue.value ?? 0));

const digitsOnly = (value: string): string => value.replace(/\D/g, '');

const formatGrouped = (digits: string): string => {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formattedDisplay = computed(() => formatGrouped(integerDigits.value));
const measureText = computed(() => formattedDisplay.value);

const countDigitsBeforeCursor = (text: string, cursor: number): number => {
  return text.slice(0, cursor).replace(/\D/g, '').length;
};

function cursorAfterNthDigit(formatted: string, digitsLeft: number): number {
  if (digitsLeft <= 0) return 0;

  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i]!)) {
      seen++;
      if (seen === digitsLeft) return i + 1;
    }
  }
  return formatted.length;
}

const syncShellWidth = () => {
  const span = measureRef.value;
  if (!span) return;

  const width = span.getBoundingClientRect().width;
  shellWidthPx.value = Math.max(props.minWidthPx, width + shellHorizontalChromePx);
}

const applyDigits = (target: HTMLInputElement, digits: string, caretDigits: number) => {
  modelValue.value = Number(digits) || 0;

  nextTick(() => {
    const pos = cursorAfterNthDigit(formattedDisplay.value, caretDigits);
    target.setSelectionRange(pos, pos);
    syncShellWidth();
  });
}

const handleBeforeInput = (event: InputEvent) => {
  if (event.inputType === 'insertText' || event.inputType === 'insertCompositionText') {
    if (event.data && /[^\d]/.test(event.data)) {
      event.preventDefault();
    }
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();

  const target = event.target as HTMLInputElement;
  const pasted = digitsOnly(event.clipboardData?.getData('text') ?? '');

  const start = target.selectionStart ?? 0;
  const end = target.selectionEnd ?? 0;

  const digitStart = countDigitsBeforeCursor(target.value, start);
  const digitEnd = countDigitsBeforeCursor(target.value, end);

  const next =
    integerDigits.value.slice(0, digitStart) + pasted + integerDigits.value.slice(digitEnd);

  applyDigits(target, next, digitStart + pasted.length);
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const cursor = target.selectionStart ?? 0;

  const digitsLeft = countDigitsBeforeCursor(target.value, cursor);
  const nextDigits = digitsOnly(target.value);

  applyDigits(target, nextDigits, digitsLeft);
}

watchEffect(() => {
  nextTick(syncShellWidth);
});
</script>

<template>
  <div class="numeric-input">
    <div :id="labelId" class="numeric-input__label">
      {{ label }}
    </div>
    <div class="numeric-input__row">
      <div class="numeric-input__shell" :style="{ width: `${shellWidthPx}px` }">
        <div class="numeric-input__text-slot">
          <span ref="measureRef" class="numeric-input__measure" aria-hidden="true">
            {{ measureText }}
          </span>
          <input
            :id="inputId"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            class="numeric-input__field"
            :aria-labelledby="labelId"
            :value="formattedDisplay"
            @beforeinput="handleBeforeInput"
            @paste="handlePaste"
            @input="handleInput"
          />
        </div>
      </div>
      <span class="numeric-input__suffix">{{ suffix }}</span>
    </div>
  </div>
</template>

<style scoped>
.numeric-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.numeric-input:focus-within .numeric-input__label {
  color: #3d06d7;
}

.numeric-input__label {
  font-family: "Koulen", system-ui, sans-serif;
  font-size: 16px;
  line-height: 15px;
  letter-spacing: 0.02em;
  color: #1e0e4c;
}

.numeric-input__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.numeric-input__shell {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 0;
  overflow: hidden;
  padding: 8px 16px 8px 8px;
  border-radius: 6px;
  border: 1px solid #cfcadf;
  box-shadow: 0 0 0 0 transparent;
  background: #fff;
  max-width: 100%;
  cursor: text;
}

.numeric-input__shell:hover:not(:focus-within) {
  border-color: #aa9dce;
}

.numeric-input__shell:focus-within {
  border-color: #906fee;
  box-shadow: 0 0 0 0.5px #906fee;
}

.numeric-input__text-slot {
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: 1em;
}

.numeric-input__measure {
  position: absolute;
  left: 0;
  top: 0;
  width: max-content;
  visibility: hidden;
  pointer-events: none;
  white-space: pre;
}

.numeric-input__measure,
.numeric-input__field {
  font-family: "Inter", system-ui, sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1;
  color: #cfcadf;
}

.numeric-input__shell:focus-within .numeric-input__field {
  color: #1e0e4c;
}

.numeric-input__field {
  outline: none;
  caret-color: #3d06d7;
}

.numeric-input__suffix {
  position: relative;
  z-index: 1;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 18px;
  line-height: 100%;
  color: #1e0e4c;
}
</style>
