export const ConditionLoopControls = [
    {
      "keyword": "FOR",
       "body":"\nFOR    ${INDEX}    IN RANGE    2    5\n\t<statement>\nEND"
    },
    {
      "keyword": "IF",
       "body":"\nIF  <condition>\n    <statement>\nEND"
    },
    {
      "keyword": "IF ELSE",
       "body":"\nIF  <condition>\n    <statement>\nELSE  IF\n    <statement>\nELSE\n    <statement>\nEND"
    },
    {
      "keyword": "IF ELIF ELSE",
       "body":"\nIF  <condition>\n    <statement>\nELSE  IF\n    <statement>\nELSE\n    <statement>\nEND"
    }
]

export const TestcaseStates = [
  'automated',
  'validated',
  'scripted',
  'scripting'
]

export const stateColorMap = {
  "automated": "success",
  "validated": "primary",
  "scripted": "warning",
  "scripting": "danger"
}

export const initCode = `[Documentation]  Test Documentation\n[Tags]  Tag1  Tag2\n\n`