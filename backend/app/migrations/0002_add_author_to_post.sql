-- Create the procedure and set the delimiter
DROP PROCEDURE IF EXISTS addAuthor;
DELIMITER go

CREATE PROCEDURE addAuthor()

BEGIN

  -- Set the variable, count the columns named 'posts'
  DECLARE v_count INT;
  SELECT COUNT(*) into v_count FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'author';

  -- Perform the check here, determine if the column exists and perform the proper action
  IF v_count <= 0 THEN
    SELECT 'posts.author does not exist' as '';
    ALTER TABLE posts
      ADD author INT,
      ADD FOREIGN KEY (author)
        REFERENCES users(id);
    SELECT 'Created posts.author' as '';
  ELSE
    SELECT 'posts.author already exists' as '';
  END IF;

-- All done
END
go
DELIMITER ;
call addAuthor;