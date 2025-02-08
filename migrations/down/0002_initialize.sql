START TRANSACTION;

-- Create books table with single author
CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    pages INT NOT NULL,
    views INT DEFAULT 0,
    clicks INT DEFAULT 0,
    deleted_at DATETIME,
    cover_name VARCHAR(255)
);

-- Insert sample data
INSERT INTO books ( title, author, year, pages) VALUES
    ( 'СИ++ И КОМПЬЮТЕРНАЯ ГРАФИКА', 'Андрей Богуславский', 2003, 351),
    ( 'Программирование на языке Go!', 'Марк Саммерфильд', 2016, 550),
    ( 'Толковый словарь сетевых терминов и аббревиатур', 'М. Виллиамс', 2002, 368),
    ( 'Python for Data Analysis', 'Уэс Маккинни', 2022, 548),
    ( 'Thinking in Java (4th Edition)', 'Брюс Эккель', 2006, 1150),
    ( 'Introduction to Algorithms', 'Томас Кормен, Чарльз Лейзерсон, Рональд Ривест, Клиффорд Штайн', 2009, 1312),
    ( 'JavaScript Pocket Reference', 'Дэвид Флэнаган', 1998, 89),
    ( 'Adaptive Code via C#: Class and Interface Design, Design Patterns, and SOLID Principles', 'Гэри Маклин Холл', 2014, 432),
    ( 'SQL: The Complete Referenc', 'Джеймс Р. Грофф', 2003, 911),
    ( 'PHP and MySQL Web Development', 'Люк Веллинг', 2015, 592),
    ( 'Статистический анализ и визуализация данных с помощью R', 'Сергей Мастицкий', 2022, 496),
    ( 'Computer Coding for Kids', 'Джон Вудкок', 2014, 224),
    ( 'Exploring Arduino: Tools and Techniques for Engineering Wizardry', 'Джереми Блум', 2002, 385),
    ( 'Программирование микроконтроллеров для начинающих и не только', 'А. Белов', 2016, 352),
    ( 'The Internet of Things', 'Сэмюэл Грингард', 2015, 230),
    ( 'Sketching User Experiences: The Workbook', 'Сол Гринберг', 2011, 272),
    ( 'InDesign CS6', 'Александр Сераков', 2012, 576),
    ( 'Адаптивный дизайн. Делаем сайты для любых устройств', 'Тим Кедлек', 2013, 288),
    ( 'Android для разработчиков', 'Пол Дейтел, Харви Дейтел', 2017, 512),
    ( 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Роберт Мартин', 2008, 464),
    ( 'Swift Pocket Reference: Programming for iOS and OS X', 'Энтони Грей', 2015, 236),
    ( 'NoSQL Distilled: A Brief Guide to the Emerging World of Polyglot Persistence', 'Мартин Фаулер, Прамодкумар Дж. Садаладж', 2012, 192),
    ( 'Head First Ruby', 'Джей Макгаврен', 2016, 539),
    ( 'Practical Vim', 'Дрю Нейл', 2003, 351);
COMMIT;