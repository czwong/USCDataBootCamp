SELECT first_name, last_name FROM sakila.actor;

SELECT CONCAT(first_name, ' ', last_name) AS ActorName FROM sakila.actor;

SELECT actor_id, first_name, last_name FROM sakila.actor WHERE first_name = "Joe";

SELECT first_name, last_name FROM sakila.actor WHERE last_name LIKE '%GEN%';

SELECT last_name, first_name FROM sakila.actor WHERE last_name LIKE '%LI%' order by last_name ASC;

SELECT country_id, country FROM sakila.country WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

ALTER TABLE actor 
ADD description BLOB;

ALTER TABLE actor
DROP COLUMN description;

SELECT last_name, COUNT(last_name)
FROM sakila.actor
GROUP BY last_name;

/*4b*/
SELECT last_name, COUNT(last_name)
FROM sakila.actor
GROUP BY last_name
HAVING COUNT(last_name)>=2;

/*4c*/
UPDATE sakila.actor
SET first_name = "HARPO"
WHERE first_name = "GROUCHO" AND last_name = "WILLIAMS";

SELECT first_name, last_name
FROM sakila.actor
WHERE first_name = "GROUCHO" AND last_name = "WILLIAMS";

/*5a*/
CREATE TABLE address (
	address_id int AUTO_INCREMENT PRIMARY KEY,
    address varchar(50) NOT NULL,
    address2 varchar(50),
    district varchar(520) NOT NULL,
    city_id INT NOT NULL,
    postal_code INT NOT NULL,
    phone varchar(20) NOT NULL,
    location geometry NOT NULL,
    last_update timestamp NOT NULL
);

-- 6a
SELECT staff.first_name, staff.last_name, address.address
FROM staff
INNER JOIN address ON staff.address_id=address.address_id;

-- 6b
SELECT staff.first_name, staff.last_name, COUNT(payment_date) as total_rungup
FROM payment
LEFT JOIN staff ON staff.staff_id = payment.staff_id
WHERE payment_date LIKE '%2005-08%'
GROUP BY first_name, last_name;

-- 6c
SELECT title, COUNT(title) as number_of_actors
FROM sakila.film_actor
INNER JOIN sakila.film ON film.film_id = film_actor.film_id
GROUP BY title;

-- 6d
SELECT title, COUNT(title) as copies
FROM sakila.inventory
INNER JOIN sakila.film ON inventory.film_id = film.film_id
WHERE title = "Hunchback Impossible";

-- 6e
SELECT *, SUM(amount) as Total_Amount_Paid
FROM sakila.payment
JOIN sakila.customer ON payment.customer_id = customer.customer_id