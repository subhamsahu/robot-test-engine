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