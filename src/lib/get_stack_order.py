#!/usr/bin/env python3
"""
Extract the stack order of root layers from a Lottie JSON file.
Outputs a JSON file named stack-order.json in the same directory as the input file.
"""

import json
import sys
from pathlib import Path


def extract_animation_name(filename):
    """
    Extract animation name from filename (part before first underscore).
    
    Args:
        filename: The filename (e.g., "run02_character01.json")
        
    Returns:
        The animation name (e.g., "run02")
    """
    # Remove extension and get part before first underscore
    name_without_ext = Path(filename).stem
    animation_name = name_without_ext.split('_')[0]
    return animation_name


def get_stack_order(lottie_file_path):
    """
    Extract the stack order of root layers from a Lottie JSON file.
    
    Args:
        lottie_file_path: Path to the Lottie JSON file
        
    Returns:
        List of strings containing the 'nm' (name) of each root layer
        in order from bottom (first) to top (last)
    """
    try:
        # Read and parse the JSON file
        with open(lottie_file_path, 'r', encoding='utf-8') as f:
            lottie_data = json.load(f)
        
        # Get the root layers array
        layers = lottie_data.get('layers', [])
        
        if not layers:
            print(f"Warning: No 'layers' array found in {lottie_file_path}", file=sys.stderr)
            return []
        
        # Extract the 'nm' (name) field from each layer
        layer_names = []
        for layer in layers:
            layer_name = layer.get('nm', 'unnamed')
            layer_names.append(layer_name)
        
        return layer_names
        
    except FileNotFoundError:
        print(f"Error: File not found: {lottie_file_path}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {lottie_file_path}: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


def write_stack_order_file(lottie_file_path, layer_names):
    """
    Write stack order to stack-order.json in the same directory as input file.
    If the file already exists, merge the new data (replace existing keys, append new ones).
    
    Args:
        lottie_file_path: Path to the input Lottie JSON file
        layer_names: List of layer names in stack order
    """
    # Get the directory of the input file
    input_path = Path(lottie_file_path)
    output_dir = input_path.parent
    
    # Extract animation name from filename
    animation_name = extract_animation_name(input_path.name)
    
    # Write to stack-order.json in the same directory
    output_file = output_dir / "stack-order.json"
    
    try:
        # Try to read existing file if it exists
        if output_file.exists():
            try:
                with open(output_file, 'r', encoding='utf-8') as f:
                    output_data = json.load(f)
                
                # Ensure it's a dictionary
                if not isinstance(output_data, dict):
                    print(f"Warning: Existing {output_file} is not a valid object, creating new one", file=sys.stderr)
                    output_data = {}
                
                # Check if key already exists
                if animation_name in output_data:
                    print(f"  Replacing existing entry for '{animation_name}'", file=sys.stderr)
                else:
                    print(f"  Adding new entry for '{animation_name}'", file=sys.stderr)
                    
            except json.JSONDecodeError as e:
                print(f"Warning: Existing {output_file} has invalid JSON, creating new one: {e}", file=sys.stderr)
                output_data = {}
        else:
            output_data = {}
        
        # Update or add the animation data
        output_data[animation_name] = layer_names
        
        # Write the updated data back to file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Stack order written to: {output_file}", file=sys.stderr)
        print(f"  Animation name: {animation_name}", file=sys.stderr)
        print(f"  Layers: {len(layer_names)}", file=sys.stderr)
        print(f"  Total animations in file: {len(output_data)}", file=sys.stderr)
        
    except Exception as e:
        print(f"Error writing output file: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    """Command-line interface for the script."""
    if len(sys.argv) < 2:
        print("Usage: python get_stack_order.py <lottie_json_file>", file=sys.stderr)
        print("Example: python get_stack_order.py src/components/chars/originals/loser/loser01_character01.json", file=sys.stderr)
        sys.exit(1)
    
    file_path = sys.argv[1]
    layer_names = get_stack_order(file_path)
    
    # Write to stack-order.json in the same directory
    write_stack_order_file(file_path, layer_names)
    
    # Also print a human-readable summary
    print("\n# Stack Order (bottom to top):", file=sys.stderr)
    for i, name in enumerate(layer_names, 1):
        print(f"  {i}. {name}", file=sys.stderr)


if __name__ == "__main__":
    main()

