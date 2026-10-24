CREATE TABLE participants (
  participant_key TEXT PRIMARY KEY NOT NULL CHECK(length(participant_key) = 64),
  registered_at TEXT NOT NULL,
  gender TEXT NOT NULL CHECK(gender IN ('male', 'female', 'other')),
  age INTEGER NOT NULL CHECK(age BETWEEN 1 AND 110),
  is_student INTEGER NOT NULL CHECK(is_student IN (0, 1)),
  student_category TEXT,
  course_id INTEGER NOT NULL,
  exchanged_at TEXT,
  CHECK(
    (is_student = 0 AND student_category IS NULL) OR
    (is_student = 1 AND student_category IN ('elementary', 'juniorHigh', 'highSchool', 'university'))
  ),
  CHECK(exchanged_at IS NULL OR exchanged_at >= registered_at)
);

CREATE INDEX participants_registered_at ON participants(registered_at DESC);
CREATE INDEX participants_exchanged_at ON participants(exchanged_at DESC) WHERE exchanged_at IS NOT NULL;
