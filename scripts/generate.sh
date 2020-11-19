mkicns() {
    if [[ -z "$*" ]] || [[ "${*##*.}" != "png" ]]; then
        echo "Input file invalid"
    else
        filename="${1%.*}"
        mkdir "$filename".iconset

        for i in 16 32 128 256 ; do
            n=$(( i * 2 ))
            sips -z $i $i "$1" --out "$filename".iconset/icon_${i}x${i}.png
            sips -z $n $n "$1" --out "$filename".iconset/icon_${i}x${i}@2x.png
            [[ $n -eq 512 ]] && \
            sips -z $n $n "$1" --out "$filename".iconset/icon_${n}x${n}.png
            (( i++ ))

        done
        cp "$1" "$filename".iconset/icon_512x512@2x.png
        iconutil -c icns "$filename".iconset
        rm -r "$filename".iconset
    fi
}


mkicns "logodo.png"
