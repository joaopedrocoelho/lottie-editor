#!/usr/bin/env python3
"""
Extract assets and root layers matching an element name from a Lottie JSON file.
Outputs a JSON structure similar to the TypeScript char part files.
"""

import json
import sys
from pathlib import Path


def extract_element(lottie_file_path, element_name):
    """
    Extract assets and root layers matching the element name from a Lottie JSON file.
    
    Args:
        lottie_file_path: Path to the Lottie JSON file
        element_name: Name of the element to extract (matches 'nm' field)
        
    Returns:
        Dictionary with 'asset' array and 'layer' object (or None if not found)
    """
    try:
        # Read and parse the JSON file
        with open(lottie_file_path, 'r', encoding='utf-8') as f:
            lottie_data = json.load(f)
        
        # Extract matching assets
        assets = lottie_data.get('assets', [])
        matching_assets = []
        
        for asset in assets:
            if asset.get('nm') == element_name:
                matching_assets.append(asset)
        
        # Extract matching root layers
        root_layers = lottie_data.get('layers', [])
        matching_layer = None
        
        for layer in root_layers:
            if layer.get('nm') == element_name:
                matching_layer = layer
                break  # Take the first match
        
        # Build output structure
        output = {}
        
        if matching_assets:
            output['asset'] = matching_assets
        else:
            output['asset'] = []
        
        if matching_layer:
            output['layer'] = matching_layer
        else:
            output['layer'] = None
        
        return output
        
    except FileNotFoundError:
        print(f"Error: File not found: {lottie_file_path}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {lottie_file_path}: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


def write_output(output_data, output_file_path):
    """
    Write the extracted data to a JSON file.
    
    Args:
        output_data: Dictionary containing asset and layer data
        output_file_path: Path to the output JSON file
    """
    try:
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        asset_count = len(output_data.get('asset', []))
        has_layer = output_data.get('layer') is not None
        
        print(f"✓ Element extracted to: {output_file_path}", file=sys.stderr)
        print(f"  Assets found: {asset_count}", file=sys.stderr)
        print(f"  Root layer found: {'Yes' if has_layer else 'No'}", file=sys.stderr)
        
    except Exception as e:
        print(f"Error writing output file: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    """Command-line interface for the script."""
    if len(sys.argv) < 3:
        print("Usage: python extract_element.py <lottie_json_file> <element_name> [output_file]", file=sys.stderr)
        print("Example: python extract_element.py src/components/chars/originals/loser/loser01_character01.json accessory", file=sys.stderr)
        print("", file=sys.stderr)
        print("If output_file is not specified, outputs to stdout as JSON", file=sys.stderr)
        sys.exit(1)
    
    lottie_file_path = sys.argv[1]
    element_name = sys.argv[2]
    output_file_path = sys.argv[3] if len(sys.argv) > 3 else None
    
    # Extract the element
    output_data = extract_element(lottie_file_path, element_name)
    
    # Check if anything was found
    asset_count = len(output_data.get('asset', []))
    has_layer = output_data.get('layer') is not None
    
    if asset_count == 0 and not has_layer:
        print(f"Warning: No assets or layers found matching '{element_name}'", file=sys.stderr)
        sys.exit(1)
    
    # Write output
    if output_file_path:
        write_output(output_data, output_file_path)
    else:
        # Output to stdout
        print(json.dumps(output_data, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()

