SELECT u.full_name, u.company, COUNT(u.user_id) as u_count
FROM user as u

JOIN user_question_status as qu 
ON u.user_id  = qu.user_id

JOIN question as q
ON qu.question_id = q.question_id 

JOIN user_quiz_status AS quizs
ON u.user_id  = quizs.user_id and q.quiz_id = quizs.quiz_id

WHERE quizs.quiz_status  = 'finish' AND qu.is_correct_answer = 1

GROUP BY u.user_id 
ORDER BY u_count DESC