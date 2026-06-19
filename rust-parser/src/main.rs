use std::env;
use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

fn main() -> io::Result<()> {
    // path = argv[1]
    // std::env::args().into_iter().skip(1).next()
    // include_str!("../levels/level1.txt")
    // HashMap<String, String>
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        panic!("Please provide a filename as argument");
    }
    let filename = &args[1];
    let path = Path::new(&filename);
    let file = File::open(&path)?;
    let reader = io::BufReader::new(file);

    let mut levels = Vec::new();
    // let mut rules = std::collections::HashMap::new();
    let mut temp_board : Option<Vec<String>> = None;

    for line in reader.lines() {
        let line = line?;
        let line = line.trim();
        let line_parts: Vec<&str> = line.split_whitespace().collect();
        // if line is empty after stripping, then push temp_board to levels
        if line.is_empty() {
            if let Some(temp_board) = temp_board.as_mut() {
                levels.push(temp_board.clone());
                temp_board.clear();
            }
            continue;
        }
        
        match line_parts.get(0) {
            Some(&"GOAL") => {} // ignore for now
            Some(&"VOID") => {} // ignore for now
            Some(&"DESCRIPTION") => {} // ignore for now
            _ => {
                if let Some(temp_board) = temp_board.as_mut() {
                    temp_board.push(line.to_string());
                } else {
                    temp_board = Some(vec![line.to_string()]);
                }
            }
        }
    }

    println!("{:?}", levels);
    
    Ok(())
}
