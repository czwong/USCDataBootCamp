-- 1a
SELECT first_name, last_name FROM sakila.actor;

-- 1b
SELECT CONCAT(first_name, ' ', last_name) AS Actor_Name FROM sakila.actor;

-- 2a
SELECT actor_id, first_name, last_name FROM sakila.actor WHERE first_name = "Joe";

-- 2b
SELECT first_name, last_name FROM sakila.actor WHERE last_name LIKE '%GEN%';

-- 2c
SELECT last_name, first_name FROM sakila.actor WHERE last_name LIKE '%LI%' ORDER BY last_name ASC;

-- 2d
SELECT country_id, country FROM sakila.country WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

-- 3a
ALTER TABLE actor 
ADD description BLOB;

-- 3b
ALTER TABLE actor
DROP COLUMN description;

-- 4a
SELECT last_name, COUNT(last_name) as count
FROM sakila.actor
GROUP BY last_name;

-- 4b
SELECT last_name, COUNT(last_name) as count
FROM sakila.actor
GROUP BY last_name
HAVING COUNT(last_name)>=2;

-- 4c
UPDATE sakila.actor
SET first_name = "GROUCHO"
WHERE first_name = "HARPO" AND last_name = "WILLIAMS";

-- 4d
SELECT first_name, last_name
FROM sakila.actor
WHERE first_name = "GROUCHO" AND last_name = "WILLIAMS";

UPDATE sakila.actor
SET first_name = "HARPO"
WHERE first_name = "GROUCHO" AND last_name = "WILLIAMS";

-- 5a
CREATE TABLE address (
	address_id int AUTO_INCREMENT PRIMARY KEY,
    address varchar(50) NOT NULL,
    address2 varchar(50),
    district varchar(20) NOT NULL,
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
SELECT first_name, last_name, SUM(amount) as Total_Amount_Paid
FROM sakila.payment
JOIN sakila.customer ON payment.customer_id = customer.customer_id
GROUP BY first_name, last_name
ORDER BY last_name ASC;

-- 7a
SELECT title
FROM sakila.film
WHERE title LIKE 'K%' OR title LIKE 'Q%' and language_id = (
	SELECT language_id
    FROM sakila.language
    WHERE name = 'English'
    );
    
-- 7b
SELECT CONCAT(first_name, ' ', last_name) as actors
FROM sakila.actor
WHERE actor_id IN (
	SELECT actor_id
    FROM sakila.film_actor
    WHERE film_id IN (
		SELECT film_id
        FROM sakila.film
        WHERE title = 'Alone Trip'
        ))
ORDER BY actors ASC;

-- 7c
SELECT CONCAT(first_name, ' ', last_name) as name, email
FROM sakila.country
JOIN sakila.city ON country.country_id = city.country_id
JOIN sakila.address ON address.city_id = city.city_id
JOIN sakila.customer ON customer.address_id = address.address_id
WHERE country = "Canada"
ORDER BY name ASC;

-- 7d
SELECT title
FROM sakila.category
JOIN sakila.film_category ON category.category_id = film_category.category_id
JOIN sakila.film ON film.film_id = film_category.film_id
WHERE name = 'family';

-- 7e
SELECT title, COUNT(title) as amount_rented
FROM sakila.film
JOIN sakila.inventory ON film.film_id = inventory.film_id
JOIN sakila.rental ON inventory.inventory_id = rental.inventory_id
GROUP BY title
ORDER BY amount_rented DESC;

-- 7f
SELECT store.store_id, SUM(amount) as total_revenue
FROM sakila.store
JOIN sakila.staff ON store.store_id = staff.store_id
JOIN sakila.payment ON staff.staff_id = payment.staff_id
GROUP BY store.store_id;

-- 7g
SELECT store_id, city.city, country.country
FROM sakila.store
JOIN sakila.address ON store.address_id = address.address_id
JOIN sakila.city ON address.city_id = city.city_id
JOIN sakila.country ON city.country_id = country.country_id;

-- 7h
SELECT name, SUM(amount) as gross_revenue
FROM sakila.category
JOIN sakila.film_category ON category.category_id = film_category.category_id
JOIN sakila.inventory ON film_category.film_id = inventory.film_id
JOIN sakila.rental ON inventory.inventory_id = rental.inventory_id
JOIN sakila.payment ON rental.rental_id = payment.rental_id
GROUP BY name
ORDER BY gross_revenue DESC;

-- 8a
CREATE VIEW top_5_genres AS
	SELECT name, SUM(amount) as gross_revenue
	FROM sakila.category
	JOIN sakila.film_category ON category.category_id = film_category.category_id
	JOIN sakila.inventory ON film_category.film_id = inventory.film_id
	JOIN sakila.rental ON inventory.inventory_id = rental.inventory_id
	JOIN sakila.payment ON rental.rental_id = payment.rental_id
	GROUP BY name
	ORDER BY gross_revenue DESC
LIMIT 5;

-- 8b
SELECT * FROM sakila.top_5_genres;

-- 8c
DROP VIEW top_5_genres